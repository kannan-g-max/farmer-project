package com.farmeragri.service;

import com.farmeragri.dto.FileUploadResponse;
import com.farmeragri.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:C:/uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png");

    public FileUploadResponse storeImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Security check: prevent path traversal
        if (originalFilename.contains("..")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid filename");
        }

        // Validate extension
        String extension = StringUtils.getFilenameExtension(originalFilename);
        if (extension == null || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only jpg, jpeg, and png images are allowed");
        }

        // Keep the original filename after a UUID prefix so the stored name remains unique and readable.
        String safeOriginalFilename = originalFilename.replaceAll("[\\\\/:*?\"<>|]", "_");
        String storedFilename = UUID.randomUUID().toString() + "_" + safeOriginalFilename;

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

            // Create directory if it doesn't exist
            Files.createDirectories(uploadPath);

            Path targetLocation = uploadPath.resolve(storedFilename).normalize();
            if (!targetLocation.startsWith(uploadPath)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid filename");
            }

            // Replace existing file if necessary
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + storedFilename;

            return FileUploadResponse.builder()
                    .message("Upload successful")
                    .filename(storedFilename)
                    .fileUrl(fileUrl)
                    .build();
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file");
        }
    }

    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).resolve(filename).normalize();
    }
}
