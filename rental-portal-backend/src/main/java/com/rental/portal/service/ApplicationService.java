package com.rental.portal.service;

import com.rental.portal.model.RentalApplication;
import com.rental.portal.model.Notification;
import com.rental.portal.model.Property;
import com.rental.portal.model.User;
import com.rental.portal.repository.RentalApplicationRepository;
import com.rental.portal.repository.NotificationRepository;
import com.rental.portal.repository.PropertyRepository;
import com.rental.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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


    public List<RentalApplication> getApplications(String customerId, String propertyId) {
        if (customerId != null) {
            return rentalAppRepo.findByCustomerId(customerId);
        }
        if (propertyId != null) {
            return rentalAppRepo.findByPropertyId(propertyId);
        }
        return rentalAppRepo.findAll();
    }


    public Optional<RentalApplication> getById(String id) {
        return rentalAppRepo.findById(id);
    }


    public RentalApplication submitApplication(RentalApplication application) {
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

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId("1")
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
        Optional<RentalApplication> appOpt = rentalAppRepo.findById(id);
        if (appOpt.isEmpty()) {
            return Optional.empty();
        }

        RentalApplication application = appOpt.get();
        if (status != null) {
            application.setStatus(status);
        }
        RentalApplication updatedApp = rentalAppRepo.save(application);

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

            // Admin notification
            Notification adminNotif = Notification.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .userId("1")
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
        if (!rentalAppRepo.existsById(id)) {
            return false;
        }
        rentalAppRepo.deleteById(id);
        return true;
    }
}
