package com.rental.portal.service;

import com.rental.portal.model.MaintenanceRequest;
import com.rental.portal.model.User;
import com.rental.portal.repository.MaintenanceRequestRepository;
import com.rental.portal.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepo;


    public List<MaintenanceRequest> getRequests(String tenantId) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User currentUser = userPrincipal.getUser();
            String userRole = currentUser.getRole();

            if (tenantId != null) {
                boolean isAdmin = "ADMIN".equalsIgnoreCase(userRole);
                boolean isOwnRecord = tenantId.equals(currentUser.getId());

                if (!isAdmin && !isOwnRecord) {
                    throw new AccessDeniedException("You are not authorized to access this tenant's maintenance requests");
                }
                return maintenanceRequestRepo.findByTenantId(tenantId);
            }

            if ("ADMIN".equalsIgnoreCase(userRole)) {
                return maintenanceRequestRepo.findAll();
            } else {
                return maintenanceRequestRepo.findByTenantId(currentUser.getId());
            }
        }

        throw new AccessDeniedException("Authentication required to access maintenance requests");
    }


    public MaintenanceRequest submitRequest(MaintenanceRequest request) {
        request.setId(UUID.randomUUID().toString().substring(0, 8));
        request.setRaisedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        request.setStatus("pending");
        request.setResolvedAt(null);
        return maintenanceRequestRepo.save(request);
    }


    public Optional<MaintenanceRequest> updateRequest(String id, MaintenanceRequest updateData) {
        Optional<MaintenanceRequest> reqOpt = maintenanceRequestRepo.findById(id);
        if (reqOpt.isEmpty()) {
            return Optional.empty();
        }

        MaintenanceRequest request = reqOpt.get();
        if (updateData.getStatus() != null) {
            request.setStatus(updateData.getStatus());

            if ("Resolved".equalsIgnoreCase(updateData.getStatus())) {
                request.setResolvedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
            }
        }
        
        if (updateData.getAdminNote() != null) request.setAdminNote(updateData.getAdminNote());
        if (updateData.getUrgency() != null) request.setUrgency(updateData.getUrgency());

        return Optional.of(maintenanceRequestRepo.save(request));
    }
}
