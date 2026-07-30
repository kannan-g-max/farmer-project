package com.farmeragri.service;

import com.farmeragri.dto.FileUploadResponse;
import com.farmeragri.dto.ProductDTO;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Product;
import com.farmeragri.entity.PublicUser;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.repository.PublicUserRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmerUserRepository farmerUserRepository;
    private final PublicUserRepository publicUserRepository;
    private final FileStorageService fileStorageService;
    private final JwtService jwtService;
    @org.springframework.beans.factory.annotation.Value("${app.base-url:http://localhost:8080}")
    private String baseUrl = "http://localhost:8080";

    public List<ProductDTO> getFarmerProducts(Long farmerId) {
        return productRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream()
                .map(this::toProductDto)
                .toList();
    }

    public List<ProductDTO> getFeed(String authorization) {
        PublicUser buyer = null;
        if (authorization != null && authorization.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parseClaims(authorization.substring(7));
                if ("PUBLIC".equals(String.valueOf(claims.get("role")))) {
                    Long buyerId = Long.valueOf(String.valueOf(claims.get("userId")));
                    buyer = publicUserRepository.findById(buyerId).orElse(null);
                }
            } catch (Exception ignored) {}
        }

        final PublicUser finalBuyer = buyer;
        List<Product> allProducts = productRepository.findByInStockTrueOrderByCreatedAtDesc();

        if (finalBuyer != null && finalBuyer.getLatitude() != null && finalBuyer.getLongitude() != null) {
            return allProducts.stream()
                    .map(product -> {
                        FarmerUser farmer = farmerUserRepository.findById(product.getFarmerId()).orElse(null);
                        if (farmer == null) {
                            return null;
                        }
                        String distanceStr = null;
                        if (farmer.getLatitude() != null && farmer.getLongitude() != null) {
                            double distance = OrderService.calculateDistance(
                                    finalBuyer.getLatitude(), finalBuyer.getLongitude(),
                                    farmer.getLatitude(), farmer.getLongitude()
                            );
                            if (distance > 50.0) {
                                return null;
                            }
                            distanceStr = String.format(java.util.Locale.ROOT, "%.1f km", distance);
                        }
                        return ProductDTO.from(product, farmer, distanceStr, resolvePublicImageUrl(product.getImageUrl()));
                    })
                    .filter(java.util.Objects::nonNull)
                    .toList();
        } else {
            return allProducts.stream()
                    .map(this::toProductDto)
                    .toList();
        }
    }

    @Transactional
    public ProductDTO uploadProduct(String authorization,
                                    MultipartFile file,
                                    String name,
                                    Double quantity,
                                    String unit,
                                    Double price,
                                    String category,
                                    String description) {
        if (!StringUtils.hasText(name)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (quantity == null || quantity <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
        }
        if (!StringUtils.hasText(unit)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unit is required");
        }
        if (price == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Price is required");
        }
        if (!StringUtils.hasText(category)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Category is required");
        }
        if (!StringUtils.hasText(description)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Description is required");
        }

        Claims claims = claimsFromAuthorization(authorization);
        if (!"FARMER".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Long farmerId = Long.valueOf(String.valueOf(claims.get("userId")));
        FarmerUser farmer = farmerUserRepository.findById(farmerId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        FileUploadResponse response = fileStorageService.storeImage(file);

        Product product = productRepository.save(Product.builder()
                .farmerId(farmerId)
                .name(name.trim())
            .quantity(quantity)
            .unit(normalizeUnit(unit))
                .price(price)
            .category(normalizeCategory(category))
                .description(description.trim())
                .imageUrl(response.getFileUrl())
                .inStock(true)
                .build());

        return ProductDTO.from(product, farmer, null, resolvePublicImageUrl(product.getImageUrl()));
    }

    @Transactional
    public void deleteProduct(String authorization, Long productId) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"FARMER".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Long farmerId = Long.valueOf(String.valueOf(claims.get("userId")));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getFarmerId().equals(farmerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        productRepository.delete(product);
    }

    @Transactional
    public ProductDTO updateStockStatus(String authorization, Long productId, Boolean inStock) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"FARMER".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Long farmerId = Long.valueOf(String.valueOf(claims.get("userId")));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getFarmerId().equals(farmerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        product.setInStock(inStock);
        Product saved = productRepository.save(product);
        FarmerUser farmer = farmerUserRepository.findById(farmerId).orElse(null);
        return ProductDTO.from(saved, farmer, null, resolvePublicImageUrl(saved.getImageUrl()));
    }

    @Transactional
    public ProductDTO updateProduct(String authorization,
                                    Long productId,
                                    String name,
                                    Double quantity,
                                    String unit,
                                    Double price,
                                    String category,
                                    String description) {
        Claims claims = claimsFromAuthorization(authorization);
        if (!"FARMER".equals(String.valueOf(claims.get("role")))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        Long farmerId = Long.valueOf(String.valueOf(claims.get("userId")));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getFarmerId().equals(farmerId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        if (name != null && !name.trim().isEmpty()) {
            product.setName(name.trim());
        }
        if (quantity != null) {
            if (quantity <= 0) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
            }
            product.setQuantity(quantity);
        }
        if (unit != null && !unit.trim().isEmpty()) {
            product.setUnit(normalizeUnit(unit));
        }
        if (price != null) {
            product.setPrice(price);
        }
        if (category != null && !category.trim().isEmpty()) {
            product.setCategory(normalizeCategory(category));
        }
        if (description != null && !description.trim().isEmpty()) {
            product.setDescription(description.trim());
        }

        if (product.getQuantity() != null && product.getQuantity() <= 0) {
            product.setQuantity(0.0);
            product.setInStock(false);
        } else {
            product.setInStock(true);
        }

        Product saved = productRepository.save(product);
        FarmerUser farmer = farmerUserRepository.findById(farmerId).orElse(null);
        return ProductDTO.from(saved, farmer, null, resolvePublicImageUrl(saved.getImageUrl()));
    }

    private ProductDTO toProductDto(Product product) {
        FarmerUser farmer = farmerUserRepository.findById(product.getFarmerId()).orElse(null);
        return ProductDTO.from(product, farmer, null, resolvePublicImageUrl(product.getImageUrl()));
    }

    private Claims claimsFromAuthorization(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        try {
            return jwtService.parseClaims(authorization.substring(7));
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }

    private String resolvePublicImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return imageUrl;
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }
        return baseUrl + imageUrl;
    }

    private String normalizeCategory(String category) {
        String normalized = category == null ? "" : category.trim();
        if (normalized.equalsIgnoreCase("vegetables")) {
            return "Vegetables";
        }
        if (normalized.equalsIgnoreCase("fruits")) {
            return "Fruits";
        }
        return "Others";
    }

    private String normalizeUnit(String unit) {
        return unit == null ? "kg" : unit.trim().toLowerCase();
    }
}
