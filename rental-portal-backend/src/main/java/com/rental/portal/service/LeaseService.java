package com.rental.portal.service;

import com.rental.portal.model.Lease;
import com.rental.portal.model.Rent;
import com.rental.portal.model.Notification;
import com.rental.portal.repository.LeaseRepository;
import com.rental.portal.repository.RentRepository;
import com.rental.portal.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LeaseService {

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    public List<Lease> getLeases(String tenantId) {
        if (tenantId != null) {
            return leaseRepository.findByTenantId(tenantId);
        }
        return leaseRepository.findAll();
    }


    public Optional<Lease> getById(String id) {
        return leaseRepository.findById(id);
    }


    public Lease createLease(Lease lease) {
        lease.setId(UUID.randomUUID().toString().substring(0, 8));
        if (lease.getStatus() == null) {
            lease.setStatus("pending_signature");
        }
        Lease savedLease = leaseRepository.save(lease);
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
        Optional<Lease> leaseOpt = leaseRepository.findById(id);
        if (leaseOpt.isEmpty()) {
            return Optional.empty();
        }

        Lease lease = leaseOpt.get();
        if (updateData.getStatus() != null) lease.setStatus(updateData.getStatus());
        if (updateData.getConditions() != null) lease.setConditions(updateData.getConditions());
        if (updateData.getStartDate() != null) lease.setStartDate(updateData.getStartDate());
        if (updateData.getEndDate() != null) lease.setEndDate(updateData.getEndDate());
        if (updateData.getContractText() != null) lease.setContractText(updateData.getContractText());

        return Optional.of(leaseRepository.save(lease));
    }


    public Optional<Lease> signLease(String id, String signatureBase64) {
        Optional<Lease> leaseOpt = leaseRepository.findById(id);
        if (leaseOpt.isEmpty()) {
            return Optional.empty();
        }

        Lease lease = leaseOpt.get();
        lease.setSignatureImage(signatureBase64);
        lease.setStatus("active");
        Lease savedLease = leaseRepository.save(lease);

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

            // Admin notification
            Notification adminNotif = Notification.builder()
                                        .id(UUID.randomUUID().toString().substring(0, 8))
                                        .userId("1")
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
