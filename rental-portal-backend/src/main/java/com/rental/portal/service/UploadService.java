package com.rental.portal.service;

import com.rental.portal.util.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {

    @Autowired
    private CloudinaryService cloudinaryService;

    
    public String uploadFile(MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }
}
