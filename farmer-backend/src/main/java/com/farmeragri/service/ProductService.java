package com.farmeragri.service;

import com.farmeragri.dto.FileUploadResponse;
import com.farmeragri.dto.ProductDTO;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Product;
import com.farmeragri.exception.ApiException;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.ProductRepository;
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
    private final FileStorageService fileStorageService;
    private final JwtService jwtService;
    @org.springframework.beans.factory.annotation.Value("${app.base-url:http://localhost:8080}")
    private String baseUrl = "http://localhost:8080";

    public List<ProductDTO> getFarmerProducts(Long farmerId) {
        return productRepository.findByFarmerId(farmerId).stream()
                .map(this::toProductDto)
                .toList();
    }

    public List<ProductDTO> getFeed() {
        return productRepository.findAll().stream()
                .map(this::toProductDto)
                .toList();
    }

    @Transactional
    public ProductDTO uploadProduct(String authorization,
                                    MultipartFile file,
                                    String name,
                                    Double price,
                                    String description) {
        if (!StringUtils.hasText(name)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (price == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Price is required");
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
                .price(price)
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
    public ProductDTO updateProduct(String authorization, Long productId, String name, Double price, String description) {
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
        if (price != null) {
            product.setPrice(price);
        }
        if (description != null && !description.trim().isEmpty()) {
            product.setDescription(description.trim());
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
}
