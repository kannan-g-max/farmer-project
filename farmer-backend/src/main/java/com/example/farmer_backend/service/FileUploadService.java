package com.example.farmer_backend.service;

import com.example.farmer_backend.dto.response.FileUploadResponse;
import com.example.farmer_backend.entity.UploadedFile;
import com.example.farmer_backend.entity.User;
import com.example.farmer_backend.exception.ApiException;
import com.example.farmer_backend.repository.UploadedFileRepository;
import com.example.farmer_backend.repository.UserRepository;
import com.example.farmer_backend.security.AppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final UploadedFileRepository uploadedFileRepository;
    private final UserRepository userRepository;

    @Value("${upload.folder:uploads}")
    private String uploadFolder;

    @Value("${max.upload.size:10485760}")
    private long maxUploadSize;

    @Transactional
    public FileUploadResponse uploadImage(MultipartFile image, Authentication authentication) {
        if (image == null || image.isEmpty() || image.getOriginalFilename() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Upload failed");
        }
        if (image.getSize() > maxUploadSize) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Upload failed");
        }
        if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Upload failed");
        }

        User user = authenticatedUser(authentication);
        String originalFilename = StringUtils.cleanPath(image.getOriginalFilename());
        String extension = StringUtils.getFilenameExtension(originalFilename);
        String storedFilename = UUID.randomUUID() + (extension == null ? "" : "." + extension.toLowerCase());

        try {
            Path uploadPath = Paths.get(uploadFolder).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetPath = uploadPath.resolve(storedFilename).normalize();
            if (!targetPath.startsWith(uploadPath)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Upload failed");
            }

            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            uploadedFileRepository.save(UploadedFile.builder()
                    .originalFilename(originalFilename)
                    .storedFilename(storedFilename)
                    .contentType(image.getContentType())
                    .fileSize(image.getSize())
                    .filePath(targetPath.toString())
                    .uploadedBy(user.getFarmerId())
                    .build());

            return FileUploadResponse.builder()
                    .message("Upload successful")
                    .fileUrl("/uploads/" + storedFilename)
                    .filename(originalFilename)
                    .build();
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload failed");
        }
    }

    private User authenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails userDetails)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return userRepository.findById(userDetails.getId())
                .filter(user -> user.getFarmerId() != null)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }
}
