package com.rental.portal.service;

import com.rental.portal.model.MaintenanceRequest;
import com.rental.portal.model.Notification;
import com.rental.portal.model.Property;
import com.rental.portal.model.User;
import com.rental.portal.repository.MaintenanceRequestRepository;
import com.rental.portal.repository.NotificationRepository;
import com.rental.portal.repository.PropertyRepository;
import com.rental.portal.repository.UserRepository;
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

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private PropertyRepository propertyRepo;

    @Autowired
    private UserRepository userRepo;


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

                if (isAdmin) {
                    List<String> ownedPropertyIds = propertyRepo.findByOwnerId(currentUser.getId()).stream()
                            .map(Property::getId)
                            .collect(java.util.stream.Collectors.toList());
                    if (ownedPropertyIds.isEmpty()) {
                        return new java.util.ArrayList<>();
                    }
                    return maintenanceRequestRepo.findByPropertyIdIn(ownedPropertyIds).stream()
                            .filter(r -> tenantId.equals(r.getTenantId()))
                            .collect(java.util.stream.Collectors.toList());
                }
                return maintenanceRequestRepo.findByTenantId(tenantId);
            }

            if ("ADMIN".equalsIgnoreCase(userRole)) {
                List<String> ownedPropertyIds = propertyRepo.findByOwnerId(currentUser.getId()).stream()
                        .map(Property::getId)
                        .collect(java.util.stream.Collectors.toList());
                if (ownedPropertyIds.isEmpty()) {
                    return new java.util.ArrayList<>();
                }
                return maintenanceRequestRepo.findByPropertyIdIn(ownedPropertyIds);
            } 
            else {
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
        MaintenanceRequest savedRequest = maintenanceRequestRepo.save(request);

        try {
            String propertyTitle = "Property";
            Optional<Property> propOpt = propertyRepo.findById(request.getPropertyId());
            if (propOpt.isPresent()) {
                propertyTitle = propOpt.get().getTitle();
            }

            String tenantName = "Tenant";
            Optional<User> userOpt = userRepo.findById(request.getTenantId());
            if (userOpt.isPresent()) {
                tenantName = userOpt.get().getName();
            }

            String urgencyLabel = request.getUrgency();
            String notificationType = "info";
            if ("high".equalsIgnoreCase(request.getUrgency()) || "emergency".equalsIgnoreCase(request.getUrgency())) {
                notificationType = "warning";
            }

            // Customer notification
            Notification tenantNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(request.getTenantId())
                    .title("Support Request Raised")
                    .message("Your support request #" + request.getId() + " (" + request.getCategory() + ") was successfully raised. Urgency: " + urgencyLabel)
                    .type(notificationType)
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(tenantNotif);

            String propertyOwnerId = "1";
            if (propOpt.isPresent() && propOpt.get().getOwnerId() != null) {
                propertyOwnerId = propOpt.get().getOwnerId();
            }

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(propertyOwnerId)
                    .title("New Support Request")
                    .message("A new support request #" + request.getId() + " (" + request.getCategory() + ") has been raised by " + tenantName + " for unit \"" + propertyTitle + "\".")
                    .type("warning")
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(adminNotif);
        } catch (Exception ex) {
            // do not throw error here cause its just a notification
        }

        return savedRequest;
    }


    public Optional<MaintenanceRequest> updateRequest(String id, MaintenanceRequest updateData) {
        Optional<MaintenanceRequest> reqOpt = maintenanceRequestRepo.findById(id);
        if (reqOpt.isEmpty()) {
            return Optional.empty();
        }

        MaintenanceRequest request = reqOpt.get();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User currentUser = userPrincipal.getUser();

            if ("ADMIN".equalsIgnoreCase(currentUser.getRole())) {
                Optional<Property> prop = propertyRepo.findById(request.getPropertyId());
                if (prop.isPresent() && !currentUser.getId().equals(prop.get().getOwnerId())) {
                    throw new AccessDeniedException("You do not own the property for this request");
                }
            }
        }

        if (updateData.getStatus() != null) {
            request.setStatus(updateData.getStatus());

            if ("Resolved".equalsIgnoreCase(updateData.getStatus())) {
                request.setResolvedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
            }
        }
        
        if (updateData.getAdminNote() != null) request.setAdminNote(updateData.getAdminNote());
        if (updateData.getUrgency() != null) request.setUrgency(updateData.getUrgency());

        MaintenanceRequest updatedRequest = maintenanceRequestRepo.save(request);

        try {
            String statusLabel = request.getStatus();
            String notificationType = "info";
            String title = "Support Request Updated";
            String msg = "Your support request #" + request.getId() + " (" + request.getCategory() + ") has been updated to: " + statusLabel;

            if ("resolved".equalsIgnoreCase(request.getStatus())) {
                notificationType = "success";
                title = "Support Request Resolved!";
                msg = "Your support request #" + request.getId() + " (" + request.getCategory() + ") has been marked as Resolved. Admin note: " + (request.getAdminNote() != null ? request.getAdminNote() : "No note provided.");
            }

            // Customer notification
            Notification tenantNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(request.getTenantId())
                    .title(title)
                    .message(msg)
                    .type(notificationType)
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(tenantNotif);

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId("1")
                    .title("Support Request Updated")
                    .message("Support request #" + request.getId() + " (" + request.getCategory() + ") status updated to: " + statusLabel + ".")
                    .type("info")
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(adminNotif);
        } catch (Exception ex) {
            // do not throw error here cause its just a notification
        }

        return Optional.of(updatedRequest);
    }
}
