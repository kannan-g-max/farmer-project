package com.example.farmer_backend.controller;

import com.example.farmer_backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FileController {

    @Value("${upload.folder:uploads}")
    private String uploadFolder;

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getUploadedFile(@PathVariable String filename) {
        try {
            Path uploadPath = Paths.get(uploadFolder).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(StringUtils.cleanPath(filename)).normalize();
            if (!filePath.startsWith(uploadPath)) {
                throw new ApiException(HttpStatus.NOT_FOUND, "File not found");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ApiException(HttpStatus.NOT_FOUND, "File not found");
            }

            return ResponseEntity.ok(resource);
        } catch (MalformedURLException ex) {
            throw new ApiException(HttpStatus.NOT_FOUND, "File not found");
        }
    }
}
