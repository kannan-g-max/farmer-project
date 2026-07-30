package com.farmeragri.controller;

import com.farmeragri.dto.ProductDTO;
import com.farmeragri.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc(addFilters = false)
@SpringBootTest(classes = com.example.farmer_backend.FarmerBackendApplication.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void uploadUsesMultipartPartsFileNamePriceAndDescription() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "tomato.jpg",
                "image/jpeg",
                "image-bytes".getBytes()
        );

        ProductDTO dto = ProductDTO.builder()
                .id(1L)
                .name("Tomato")
                .price(12.5)
                .description("Fresh tomatoes")
                .imageUrl("http://localhost:8080/uploads/tomato.jpg")
                .farmerName("Kannan")
                .farmerHandle("@farm001")
                .build();

        when(productService.uploadProduct(
                eq("Bearer token"),
                any(MultipartFile.class),
                eq("Tomato"),
                eq(12.5),
                eq("Fresh tomatoes")
        )).thenReturn(dto);

        mockMvc.perform(multipart("/api/products/upload")
                        .file(file)
                        .param("name", "Tomato")
                        .param("price", "12.5")
                        .param("description", "Fresh tomatoes")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Tomato"))
                .andExpect(jsonPath("$.price").value(12.5))
                .andExpect(jsonPath("$.description").value("Fresh tomatoes"))
                .andExpect(jsonPath("$.imageUrl").value("http://localhost:8080/uploads/tomato.jpg"))
                .andExpect(jsonPath("$.farmerName").value("Kannan"))
                .andExpect(jsonPath("$.farmerHandle").value("@farm001"));

        verify(productService).uploadProduct(
                eq("Bearer token"),
                any(MultipartFile.class),
                eq("Tomato"),
                eq(12.5),
                eq("Fresh tomatoes")
        );
    }

    @Test
    void uploadRejectsMissingNamePart() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "tomato.jpg",
                "image/jpeg",
                "image-bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/products/upload")
                        .file(file)
                        .param("price", "12.5")
                        .param("description", "Fresh tomatoes")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid request"));
    }
}
