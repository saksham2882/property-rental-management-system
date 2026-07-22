package com.rental.portal.service;

import com.rental.portal.model.RentalApplication;
import com.rental.portal.model.Notification;
import com.rental.portal.model.Property;
import com.rental.portal.model.User;
import com.rental.portal.repository.RentalApplicationRepository;
import com.rental.portal.repository.NotificationRepository;
import com.rental.portal.repository.PropertyRepository;
import com.rental.portal.repository.UserRepository;
import com.rental.portal.security.UserPrincipal;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private RentalApplicationRepository rentalAppRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private PropertyRepository propertyRepo;

    @Autowired
    private UserRepository userRepo;


    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUser().getId();
        }
        return null;
    }

    private boolean isCurrentUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return "admin".equalsIgnoreCase(((UserPrincipal) authentication.getPrincipal()).getUser().getRole());
        }
        return false;
    }

    public List<RentalApplication> getApplications(String customerId, String propertyId) {
        String currentUserId = getCurrentUserId();
        if (!isCurrentUserAdmin()) {
            if (customerId != null && !customerId.equals(currentUserId)) {
                throw new AccessDeniedException("You are not authorized to view applications for other users");
            }
            return rentalAppRepo.findByCustomerId(currentUserId);
        }

        // Admin path
        if (customerId != null) {
            // Find properties owned by this admin
            List<String> ownedPropertyIds = propertyRepo.findByOwnerId(currentUserId).stream()
                    .map(Property::getId)
                    .collect(Collectors.toList());
            if (ownedPropertyIds.isEmpty()) {
                return new ArrayList<>();
            }
            return rentalAppRepo.findByCustomerId(customerId).stream()
                    .filter(a -> ownedPropertyIds.contains(a.getPropertyId()))
                    .collect(Collectors.toList());
        }

        if (propertyId != null) {
            Optional<Property> prop = propertyRepo.findById(propertyId);
            if (prop.isEmpty() || !currentUserId.equals(prop.get().getOwnerId())) {
                return new ArrayList<>();
            }
            return rentalAppRepo.findByPropertyId(propertyId);
        }

        List<String> ownedPropertyIds = propertyRepo.findByOwnerId(currentUserId).stream()
                .map(Property::getId)
                .collect(Collectors.toList());

        if (ownedPropertyIds.isEmpty()) {
            return new ArrayList<>();
        }
        return rentalAppRepo.findByPropertyIdIn(ownedPropertyIds);
    }


    public Optional<RentalApplication> getById(String id) {
        Optional<RentalApplication> appOpt = rentalAppRepo.findById(id);
        if (appOpt.isPresent()) {
            String currentUserId = getCurrentUserId();
            RentalApplication application = appOpt.get();

            if (isCurrentUserAdmin()) {
                Optional<Property> prop = propertyRepo.findById(application.getPropertyId());
                if (prop.isEmpty() || !currentUserId.equals(prop.get().getOwnerId())) {
                    throw new AccessDeniedException("You are not authorized to view this application");
                }
            } else {
                if (!currentUserId.equals(application.getCustomerId())) {
                    throw new AccessDeniedException("You are not authorized to view this application");
                }
            }
        }
        return appOpt;
    }


    public RentalApplication submitApplication(RentalApplication application) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new AccessDeniedException("Guest users are not allowed to submit rental applications. Please sign up.");
        }
        if (currentUserId != null) {
            application.setCustomerId(currentUserId);
        }

        application.setId(UUID.randomUUID().toString().substring(0, 8));
        application.setAppliedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        application.setStatus("under_review");
        RentalApplication savedApp = rentalAppRepo.save(application);

        try {
            String propertyTitle = "Property";
            Optional<Property> propOpt = propertyRepo.findById(application.getPropertyId());
            if (propOpt.isPresent()) {
                propertyTitle = propOpt.get().getTitle();
            }

            String customerName = "Applicant";
            Optional<User> userOpt = userRepo.findById(application.getCustomerId());
            if (userOpt.isPresent()) {
                customerName = userOpt.get().getName();
            }

            // Customer notification
            Notification customerNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(application.getCustomerId())
                    .title("Application Submitted")
                    .message("Your rental application for property \"" + propertyTitle + "\" has been successfully submitted and is under review.")
                    .type("success")
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(customerNotif);

            String propertyOwnerId = "1";
            if (propOpt.isPresent() && propOpt.get().getOwnerId() != null) {
                propertyOwnerId = propOpt.get().getOwnerId();
            }

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(propertyOwnerId)
                    .title("New Application Received")
                    .message("New rental application submitted by " + customerName + " for property \"" + propertyTitle + "\".")
                    .type("info")
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(adminNotif);
        } catch (Exception ex) {
            // do not throw error here cause its just a notification
        }

        return savedApp;
    }


    public Optional<RentalApplication> updateStatus(String id, String status) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new AccessDeniedException("Guest users are not allowed to update application status. Please sign up.");
        }
        Optional<RentalApplication> appOpt = rentalAppRepo.findById(id);
        if (appOpt.isEmpty()) {
            return Optional.empty();
        }

        RentalApplication application = appOpt.get();
        if (isCurrentUserAdmin()) {
            Optional<Property> prop = propertyRepo.findById(application.getPropertyId());
            if (prop.isPresent() && !currentUserId.equals(prop.get().getOwnerId())) {
                throw new AccessDeniedException("You do not own the property for this application");
            }
        }

        if (status != null) {
            application.setStatus(status);
        }
        RentalApplication updatedApp = rentalAppRepo.save(application);

        if ("approved".equalsIgnoreCase(status) && application.getPropertyId() != null) {
            propertyRepo.findById(application.getPropertyId()).ifPresent(property -> {
                property.setAvailable(false);
                propertyRepo.save(property);
            });
        }

        try {
            String propertyTitle = "Property";
            Optional<Property> propOpt = propertyRepo.findById(application.getPropertyId());
            if (propOpt.isPresent()) {
                propertyTitle = propOpt.get().getTitle();
            }

            String customerName = "Applicant";
            Optional<User> userOpt = userRepo.findById(application.getCustomerId());
            if (userOpt.isPresent()) {
                customerName = userOpt.get().getName();
            }

            String statusLabel = status;
            String notificationType = "info";
            String title = "Application Updated";
            String msg = "Your application for property \"" + propertyTitle + "\" is currently: " + status;

            if ("approved".equalsIgnoreCase(status)) {
                statusLabel = "Approved";
                notificationType = "success";
                title = "Application Approved!";
                msg = "Congratulations! Your rental application for property \"" + propertyTitle + "\" has been approved. The lease agreement will be shared shortly.";
            } 
            else if ("rejected".equalsIgnoreCase(status)) {
                statusLabel = "Rejected";
                notificationType = "error";
                title = "Application Rejected";
                msg = "We regret to inform you that your application for property \"" + propertyTitle + "\" has been rejected.";
            }

            // Customer notification
            Notification customerNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(application.getCustomerId())
                    .title(title)
                    .message(msg)
                    .type(notificationType)
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(customerNotif);

            String propertyOwnerId = "1";
            if (propOpt.isPresent() && propOpt.get().getOwnerId() != null) {
                propertyOwnerId = propOpt.get().getOwnerId();
            }

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId(propertyOwnerId)
                    .title("Application Status Changed")
                    .message("The application from " + customerName + " for \"" + propertyTitle + "\" has been marked as: " + statusLabel + ".")
                    .type("info")
                    .isRead(false)
                    .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                    .build();
            notificationRepo.save(adminNotif);
        } catch (Exception ex) {
            // do not throw error here cause its just a notification
        }

        return Optional.of(updatedApp);
    }


    public boolean deleteApplication(String id) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new AccessDeniedException("Guest users are not allowed to delete applications. Please sign up.");
        }
        Optional<RentalApplication> appOpt = rentalAppRepo.findById(id);
        if (appOpt.isEmpty()) {
            return false;
        }
        if (isCurrentUserAdmin()) {
            Optional<Property> prop = propertyRepo.findById(appOpt.get().getPropertyId());
            if (prop.isEmpty() || !currentUserId.equals(prop.get().getOwnerId())) {
                throw new AccessDeniedException("You are not authorized to delete this application");
            }
        } else {
            if (!currentUserId.equals(appOpt.get().getCustomerId())) {
                throw new AccessDeniedException("You are not authorized to delete this application");
            }
        }
        rentalAppRepo.deleteById(id);
        return true;
    }
}
