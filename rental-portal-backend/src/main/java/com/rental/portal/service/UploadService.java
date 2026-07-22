package com.rental.portal.service;

import com.rental.portal.util.CloudinaryService;
import com.rental.portal.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {

    @Autowired
    private CloudinaryService cloudinaryService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUser().getId();
        }
        return null;
    }
    
    public String uploadFile(MultipartFile file) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            try {
                byte[] bytes = file.getBytes();
                String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
                return "data:" + file.getContentType() + ";base64," + base64;
            } catch (Exception e) {
                return "";
            }
        }
        return cloudinaryService.uploadFile(file);
    }
}
