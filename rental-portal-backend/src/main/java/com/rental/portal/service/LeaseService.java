package com.rental.portal.service;

import com.rental.portal.model.Lease;
import com.rental.portal.model.Rent;
import com.rental.portal.model.Property;
import com.rental.portal.model.Notification;
import com.rental.portal.repository.LeaseRepository;
import com.rental.portal.repository.RentRepository;
import com.rental.portal.repository.UserRepository;
import com.rental.portal.repository.NotificationRepository;
import com.rental.portal.repository.PropertyRepository;
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
public class LeaseService {

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;


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

    private void populateLandlordName(List<Lease> leases) {
        for (Lease l : leases) {
            populateLandlordName(l);
        }
    }

    private void populateLandlordName(Lease lease) {
        if (lease.getPropertyId() != null) {
            propertyRepository.findById(lease.getPropertyId()).ifPresent(property -> {
                if (property.getOwnerId() != null) {
                    userRepository.findById(property.getOwnerId()).ifPresent(u -> lease.setLandlordName(u.getName()));
                }
            });
        }
    }

    public List<Lease> getLeases(String tenantId) {
        String currentUserId = getCurrentUserId();
        List<Lease> leases;
        if (!isCurrentUserAdmin()) {
            if (tenantId != null && !tenantId.equals(currentUserId)) {
                throw new AccessDeniedException("You are not authorized to view leases for other users");
            }
            leases = leaseRepository.findByTenantId(currentUserId);
        } 
        else {
            // Admin path
            if (tenantId != null) {
                List<String> ownedPropertyIds = propertyRepository.findByOwnerId(currentUserId).stream()
                        .map(Property::getId)
                        .collect(Collectors.toList());
                if (ownedPropertyIds.isEmpty()) {
                    leases = new ArrayList<>();
                } else {
                    leases = leaseRepository.findByTenantId(tenantId).stream()
                            .filter(l -> ownedPropertyIds.contains(l.getPropertyId()))
                            .collect(Collectors.toList());
                }
            } 
            else {
                List<String> ownedPropertyIds = propertyRepository.findByOwnerId(currentUserId).stream()
                        .map(Property::getId)
                        .collect(Collectors.toList());
                if (ownedPropertyIds.isEmpty()) {
                    leases = new ArrayList<>();
                } else {
                    leases = leaseRepository.findByPropertyIdIn(ownedPropertyIds);
                }
            }
        }
        populateLandlordName(leases);
        return leases;
    }


    public Optional<Lease> getById(String id) {
        Optional<Lease> leaseOpt = leaseRepository.findById(id);
        if (leaseOpt.isPresent()) {
            String currentUserId = getCurrentUserId();
            Lease lease = leaseOpt.get();

            if (isCurrentUserAdmin()) {
                Optional<Property> prop = propertyRepository.findById(lease.getPropertyId());
                if (prop.isEmpty() || !currentUserId.equals(prop.get().getOwnerId())) {
                    throw new AccessDeniedException("You are not authorized to view this lease");
                }
            } else {
                if (!currentUserId.equals(lease.getTenantId())) {
                    throw new AccessDeniedException("You are not authorized to view this lease");
                }
            }
            populateLandlordName(lease);
        }
        return leaseOpt;
    }


    public Lease createLease(Lease lease) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new org.springframework.security.access.AccessDeniedException("Guest users are not allowed to create lease agreements. Please sign up.");
        }
        if (isCurrentUserAdmin()) {
            propertyRepository.findById(lease.getPropertyId()).ifPresent(property -> {
                if (!currentUserId.equals(property.getOwnerId())) {
                    throw new AccessDeniedException("You do not own this property");
                }
            });
        }
        lease.setId(UUID.randomUUID().toString().substring(0, 8));
        if (lease.getStatus() == null) {
            lease.setStatus("pending_signature");
        }
        Lease savedLease = leaseRepository.save(lease);
        populateLandlordName(savedLease);
        try {
            Notification customerNotif = Notification.builder()
                                            .id(UUID.randomUUID().toString().substring(0, 8))
                                            .userId(lease.getTenantId())
                                            .title("Lease Agreement Ready")
                                            .message("A new lease agreement for unit \"" + lease.getPropertyTitle() + "\" has been prepared. Please review and sign it.")
                                            .type("info")
                                            .isRead(false)
                                            .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                                            .build();
            notificationRepository.save(customerNotif);
        } catch (Exception ex) {
            // do not throw error here cause its just a notification
        }
        return savedLease;
    }


    public Optional<Lease> updateLease(String id, Lease updateData) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new org.springframework.security.access.AccessDeniedException("Guest users are not allowed to update lease agreements. Please sign up.");
        }
        Optional<Lease> leaseOpt = leaseRepository.findById(id);
        if (leaseOpt.isEmpty()) {
            return Optional.empty();
        }

        Lease lease = leaseOpt.get();
        if (isCurrentUserAdmin()) {
            propertyRepository.findById(lease.getPropertyId()).ifPresent(property -> {
                if (!currentUserId.equals(property.getOwnerId())) {
                    throw new AccessDeniedException("You do not own this property");
                }
            });
        }
        if (updateData.getStatus() != null) lease.setStatus(updateData.getStatus());
        if (updateData.getConditions() != null) lease.setConditions(updateData.getConditions());
        if (updateData.getStartDate() != null) lease.setStartDate(updateData.getStartDate());
        if (updateData.getEndDate() != null) lease.setEndDate(updateData.getEndDate());
        if (updateData.getContractText() != null) lease.setContractText(updateData.getContractText());

        Lease savedLease = leaseRepository.save(lease);
        populateLandlordName(savedLease);
        return Optional.of(savedLease);
    }


    public Optional<Lease> signLease(String id, String signatureBase64) {
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && currentUserId.startsWith("guest-")) {
            throw new org.springframework.security.access.AccessDeniedException("Guest users are not allowed to sign lease agreements. Please sign up.");
        }
        Optional<Lease> leaseOpt = leaseRepository.findById(id);
        if (leaseOpt.isEmpty()) {
            return Optional.empty();
        }

        Lease lease = leaseOpt.get();
        if (!currentUserId.equals(lease.getTenantId())) {
            throw new AccessDeniedException("You are not authorized to sign this lease");
        }
        lease.setSignatureImage(signatureBase64);
        lease.setStatus("active");
        Lease savedLease = leaseRepository.save(lease);
        populateLandlordName(savedLease);

        if (lease.getPropertyId() != null) {
            propertyRepository.findById(lease.getPropertyId()).ifPresent(property -> {
                property.setAvailable(false);
                propertyRepository.save(property);
            });
        }

        try {
            String monthName = "First Month";
            try {
                Date date = new SimpleDateFormat("yyyy-MM-dd").parse(lease.getStartDate());
                monthName = new SimpleDateFormat("MMMM yyyy").format(date);
            } catch (Exception e) {
                monthName = new SimpleDateFormat("MMMM yyyy").format(new Date());
            }

            double rentAmount = lease.getMonthlyRent() != null ? lease.getMonthlyRent() : 0.0;
            double depositAmount = lease.getDeposit() != null ? lease.getDeposit() : 0.0;

            Rent depositInvoice = Rent.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .leaseId(lease.getId())
                    .tenantId(lease.getTenantId())
                    .month("Security Deposit")
                    .amount(depositAmount)
                    .dueDate(lease.getStartDate())
                    .status("pending")
                    .build();
            rentRepository.save(depositInvoice);

            Rent rentInvoice = Rent.builder()
                    .id(UUID.randomUUID().toString().substring(0, 8))
                    .leaseId(lease.getId())
                    .tenantId(lease.getTenantId())
                    .month(monthName)
                    .amount(rentAmount)
                    .dueDate(lease.getStartDate())
                    .status("pending")
                    .build();
            rentRepository.save(rentInvoice);

            // Customer notification
            Notification customerNotif = Notification.builder()
                                            .id(UUID.randomUUID().toString().substring(0, 8))
                                            .userId(lease.getTenantId())
                                            .title("Lease Agreement Signed!")
                                            .message("You have successfully signed the lease for unit \"" + lease.getPropertyTitle() + "\". It is now active, and the initial invoices have been generated.")
                                            .type("success")
                                            .isRead(false)
                                            .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                                            .build();
            notificationRepository.save(customerNotif);

            String propertyOwnerId = "1";
            Optional<Property> propOpt = propertyRepository.findById(lease.getPropertyId());
            if (propOpt.isPresent() && propOpt.get().getOwnerId() != null) {
                propertyOwnerId = propOpt.get().getOwnerId();
            }

            // Admin notification
            Notification adminNotif = Notification.builder()
                                        .id(UUID.randomUUID().toString().substring(0, 8))
                                        .userId(propertyOwnerId)
                                        .title("Lease Signed by Tenant")
                                        .message("The lease agreement for unit \"" + lease.getPropertyTitle() + "\" has been signed by the tenant and is now active.")
                                        .type("success")
                                        .isRead(false)
                                        .createdAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()))
                                        .build();
            notificationRepository.save(adminNotif);
        } catch (Exception e) {
            // do not throw error here cause its just a notification
        }

        return Optional.of(savedLease);
    }
}
