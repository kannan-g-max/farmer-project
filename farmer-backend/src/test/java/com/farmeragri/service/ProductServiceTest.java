package com.farmeragri.service;

import com.farmeragri.dto.FileUploadResponse;
import com.farmeragri.dto.ProductDTO;
import com.farmeragri.entity.FarmerUser;
import com.farmeragri.entity.Product;
import com.farmeragri.repository.FarmerUserRepository;
import com.farmeragri.repository.ProductRepository;
import com.farmeragri.security.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private FarmerUserRepository farmerUserRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private ProductService productService;

    @Test
    void uploadProductPersistsCanonicalFieldsAndReturnsStableDto() {
        Claims claims = org.mockito.Mockito.mock(Claims.class);
        when(claims.get("role")).thenReturn("FARMER");
        when(claims.get("userId")).thenReturn("1");
        when(jwtService.parseClaims("token")).thenReturn(claims);

        FarmerUser farmer = FarmerUser.builder()
                .id(1L)
                .farmerId("FARM001")
                .name("Kannan")
                .build();
        when(farmerUserRepository.findById(1L)).thenReturn(Optional.of(farmer));

        when(fileStorageService.storeImage(any(MultipartFile.class))).thenReturn(FileUploadResponse.builder()
                .fileUrl("/uploads/tomato.jpg")
                .build());

        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(99L);
            return product;
        });

        ProductDTO dto = productService.uploadProduct(
                "Bearer token",
                new MockMultipartFile("file", "tomato.jpg", "image/jpeg", "image-bytes".getBytes()),
                "Tomato",
                12.5,
                "Fresh tomatoes"
        );

        assertEquals(99L, dto.getId());
        assertEquals("Tomato", dto.getName());
        assertEquals(12.5, dto.getPrice(), 0.0001);
        assertEquals("Fresh tomatoes", dto.getDescription());
        assertEquals("http://localhost:8080/uploads/tomato.jpg", dto.getImageUrl());
        assertEquals("Kannan", dto.getFarmerName());
        assertEquals("@farm001", dto.getFarmerHandle());
        assertNull(dto.getDistance());
    }

    @Test
    void getFarmerProductsSkipsIncompleteRecordsAndNormalizesTheRest() {
        Product complete = Product.builder()
                .id(10L)
                .farmerId(2L)
                .name("Spinach")
                .price(25.0)
                .description("Organic spinach")
                .imageUrl("/uploads/spinach.jpg")
                .build();

        Product incomplete = Product.builder()
                .id(11L)
                .farmerId(2L)
                .name("Broken")
                .price(10.0)
                .description("Missing image")
                .build();

        FarmerUser farmer = FarmerUser.builder()
                .id(2L)
                .farmerId("FARM002")
                .name("Ramesh")
                .build();

        when(productRepository.findByFarmerId(2L)).thenReturn(List.of(complete, incomplete));
        when(farmerUserRepository.findById(2L)).thenReturn(Optional.of(farmer));

        List<ProductDTO> products = productService.getFarmerProducts(2L);

        assertEquals(1, products.size());
        ProductDTO dto = products.get(0);
        assertEquals(10L, dto.getId());
        assertEquals("Spinach", dto.getName());
        assertEquals(25.0, dto.getPrice(), 0.0001);
        assertEquals("Organic spinach", dto.getDescription());
        assertEquals("http://localhost:8080/uploads/spinach.jpg", dto.getImageUrl());
        assertEquals("Ramesh", dto.getFarmerName());
        assertEquals("@farm002", dto.getFarmerHandle());
        assertFalse(products.stream().anyMatch(product -> "Broken".equals(product.getName())));
    }
}
