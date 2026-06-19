package com.rental.portal.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;


    @SuppressWarnings("rawtypes")
    public String uploadFile(MultipartFile file) {

        String originalFilename = file.getOriginalFilename();
        log.info("Initiating upload to Cloudinary for file: {}", originalFilename);

        try {
            String cloudName = cloudinary.config.cloudName;
            if (cloudName == null || cloudName.isEmpty() || "dummy-cloud".equalsIgnoreCase(cloudName)) {
                log.warn("Cloudinary is not configured or using dummy values. Falling back to mock URL.");
                return getMockUrl();
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", "rental_" + UUID.randomUUID().toString(),
                    "resource_type", "auto"
            ));

            String secureUrl = (String) uploadResult.get("secure_url");

            log.info("Successfully uploaded");
            return secureUrl;

        } catch (Exception ex) {
            log.error("Cloudinary upload failed. Falling back to mock URL. Error: {}", ex.getMessage());
            return getMockUrl();
        }
    }
    

    private String getMockUrl() {
        String[] mockups = {
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800"
        };
        int index = (int) (Math.random() * mockups.length);
        return mockups[index];
    }
}
