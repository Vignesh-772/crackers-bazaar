package com.crackersbazaar.service;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class S3StorageService {

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${app.upload.compress-threshold:2097152}") // 2MB
    private long compressThreshold;

    @Value("${app.upload.max-width:1920}")
    private int maxWidth;

    @Value("${app.upload.max-height:1920}")
    private int maxHeight;

    @Value("${app.upload.quality:0.85}")
    private double compressionQuality;

    @Value("${app.upload.max-size:10485760}") // 10MB
    private long maxFileSize;

    @Value("${app.upload.allowed-types:image/jpeg,image/png,image/gif,image/webp}")
    private String allowedTypes;

    /**
     * Upload and compress image to S3
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        validateFile(file);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + extension;
        String s3Key = folder + "/" + filename;

        // Get original size
        long originalSize = file.getSize();

        // Compress image if needed
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        compressImage(file, outputStream);
        byte[] imageBytes = outputStream.toByteArray();
        long compressedSize = imageBytes.length;

        // Log compression results
        if (originalSize > compressThreshold) {
            double compressionRatio = ((double)(originalSize - compressedSize) / originalSize) * 100;
            System.out.println(String.format("Image compressed: %s -> %s (%.1f%% reduction)",
                    formatFileSize(originalSize), formatFileSize(compressedSize), compressionRatio));
        }

        // Upload to S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .contentType(file.getContentType())
                .contentLength((long) imageBytes.length)
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(imageBytes));

        System.out.println("Image uploaded to S3: " + s3Key);

        // Return the S3 key (used for proxy URL)
        return s3Key;
    }

    /**
     * Upload multiple images to S3
     */
    public List<String> uploadImages(List<MultipartFile> files, String folder) throws IOException {
        List<String> s3Keys = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String s3Key = uploadImage(file, folder);
                s3Keys.add(s3Key);
            }
        }

        return s3Keys;
    }

    /**
     * Get image from S3 as byte array
     */
    public byte[] getImage(String s3Key) throws IOException {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();

            return s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
        } catch (S3Exception e) {
            throw new IOException("Failed to retrieve image from S3: " + e.getMessage());
        }
    }

    /**
     * Delete image from S3
     */
    public void deleteImage(String s3Key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            System.out.println("Image deleted from S3: " + s3Key);
        } catch (S3Exception e) {
            System.err.println("Failed to delete image from S3: " + e.getMessage());
        }
    }

    /**
     * Delete multiple images from S3
     */
    public void deleteImages(List<String> s3Keys) {
        for (String s3Key : s3Keys) {
            deleteImage(s3Key);
        }
    }

    /**
     * Check if image exists in S3
     */
    public boolean imageExists(String s3Key) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
        } catch (S3Exception e) {
            return false;
        }
    }

    /**
     * Compress image using Thumbnailator
     */
    private void compressImage(MultipartFile file, OutputStream outputStream) throws IOException {
        long fileSize = file.getSize();

        // If file is small enough, save directly without compression
        if (fileSize <= compressThreshold) {
            file.getInputStream().transferTo(outputStream);
            return;
        }

        // For larger files, compress using Thumbnailator
        try {
            BufferedImage originalImage = ImageIO.read(file.getInputStream());

            if (originalImage == null) {
                // Not a valid image, save as-is
                file.getInputStream().transferTo(outputStream);
                return;
            }

            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();

            // Calculate new dimensions if image is too large
            int targetWidth = Math.min(originalWidth, maxWidth);
            int targetHeight = Math.min(originalHeight, maxHeight);

            // Compress and resize
            Thumbnails.of(originalImage)
                    .size(targetWidth, targetHeight)
                    .keepAspectRatio(true)
                    .outputQuality(compressionQuality)
                    .outputFormat(getOutputFormat(file.getContentType()))
                    .toOutputStream(outputStream);

        } catch (Exception e) {
            System.err.println("Compression failed, saving original: " + e.getMessage());
            // Fallback: save original if compression fails
            file.getInputStream().transferTo(outputStream);
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        // Check file size
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedType(contentType)) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + allowedTypes);
        }
    }

    /**
     * Check if content type is allowed
     */
    private boolean isAllowedType(String contentType) {
        String[] allowed = allowedTypes.split(",");
        for (String type : allowed) {
            if (contentType.equals(type.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return ".jpg";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex == -1 ? ".jpg" : filename.substring(lastDotIndex);
    }

    /**
     * Get output format from content type
     */
    private String getOutputFormat(String contentType) {
        if (contentType == null) return "jpg";
        if (contentType.contains("png")) return "png";
        if (contentType.contains("gif")) return "gif";
        if (contentType.contains("webp")) return "webp";
        return "jpg";
    }

    /**
     * Format file size for human-readable output
     */
    private String formatFileSize(long size) {
        if (size < 1024) return size + " B";
        int exp = (int) (Math.log(size) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", size / Math.pow(1024, exp), pre);
    }
}

