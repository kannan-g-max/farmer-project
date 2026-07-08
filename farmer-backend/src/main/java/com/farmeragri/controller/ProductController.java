package com.farmeragri.controller;

import com.farmeragri.dto.ProductDTO;
import com.farmeragri.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/api/farmer/{farmerId}/products")
    public ResponseEntity<List<ProductDTO>> farmerProducts(@PathVariable Long farmerId) {
        return ResponseEntity.ok(productService.getFarmerProducts(farmerId));
    }

    @GetMapping("/api/products/feed")
    public ResponseEntity<List<ProductDTO>> feed() {
        return ResponseEntity.ok(productService.getFeed());
    }

    @PostMapping(value = "/api/products/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> upload(@RequestHeader("Authorization") String authorization,
                                             @RequestParam("file") MultipartFile file,
                                             @RequestParam("name") String name,
                                             @RequestParam("price") Double price,
                                             @RequestParam("description") String description) {
        return ResponseEntity.ok(productService.uploadProduct(authorization, file, name, price, description));
    }

    @DeleteMapping("/api/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@RequestHeader("Authorization") String authorization,
                                              @PathVariable Long productId) {
        productService.deleteProduct(authorization, productId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/api/products/{productId}/stock")
    public ResponseEntity<ProductDTO> updateStock(@RequestHeader("Authorization") String authorization,
                                                  @PathVariable Long productId,
                                                  @RequestParam("inStock") Boolean inStock) {
        return ResponseEntity.ok(productService.updateStockStatus(authorization, productId, inStock));
    }

    @PutMapping("/api/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@RequestHeader("Authorization") String authorization,
                                                    @PathVariable Long productId,
                                                    @RequestParam(value = "name", required = false) String name,
                                                    @RequestParam(value = "price", required = false) Double price,
                                                    @RequestParam(value = "description", required = false) String description) {
        return ResponseEntity.ok(productService.updateProduct(authorization, productId, name, price, description));
    }
}
