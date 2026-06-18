package com.farmeragri.controller;

import com.farmeragri.dto.ProductDTO;
import com.farmeragri.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = com.example.farmer_backend.FarmerBackendApplication.class)
@AutoConfigureMockMvc
class ProductSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void feedIsPubliclyAccessible() throws Exception {
        when(productService.getFeed()).thenReturn(List.of(ProductDTO.builder()
                .id(1L)
                .name("Tomato")
                .price(12.5)
                .description("Fresh tomatoes")
                .build()));

        mockMvc.perform(get("/api/products/feed"))
                .andExpect(status().isOk());
    }
}
