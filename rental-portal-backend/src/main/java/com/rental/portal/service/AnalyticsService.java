package com.rental.portal.service;

import com.rental.portal.model.*;
import com.rental.portal.repository.*;
import com.rental.portal.security.UserPrincipal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepo;

    @Autowired
    private RentalApplicationRepository rentalApplicationRepository;


    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUser().getId();
        }
        return null;
    }

    public Map<String, Object> getAdminStats() {
        String currentUserId = getCurrentUserId();
        List<Property> properties = new ArrayList<>();
        List<Lease> leases = new ArrayList<>();
        List<Rent> rents = new ArrayList<>();
        List<MaintenanceRequest> requests = new ArrayList<>();
        List<RentalApplication> applications = new ArrayList<>();

        if (currentUserId != null) {
            properties = propertyRepository.findByOwnerId(currentUserId);
            List<String> ownedPropertyIds = properties.stream().map(Property::getId).collect(Collectors.toList());

            if (!ownedPropertyIds.isEmpty()) {
                leases = leaseRepository.findByPropertyIdIn(ownedPropertyIds);
                requests = maintenanceRequestRepo.findByPropertyIdIn(ownedPropertyIds);
                applications = rentalApplicationRepository.findByPropertyIdIn(ownedPropertyIds);
                
                List<String> leaseIds = leases.stream().map(Lease::getId).collect(Collectors.toList());
                if (!leaseIds.isEmpty()) {
                    rents = rentRepository.findByLeaseIdIn(leaseIds);
                }
            }
        }

        long totalProperties = properties.size();
        long occupiedProperties = properties.stream()
                .filter(p -> Boolean.FALSE.equals(p.getAvailable()))
                .count();

        double totalRevenue = rents.stream()
                .filter(r -> "paid".equalsIgnoreCase(r.getStatus()))
                .mapToDouble(Rent::getAmount)
                .sum();

        Map<String, Integer> maintenanceStatus = new HashMap<>();
        for (MaintenanceRequest r : requests) {
            String status = r.getStatus();
            if (status != null) {
                maintenanceStatus.put(status, maintenanceStatus.getOrDefault(status, 0) + 1);
            }
        }

        Map<String, Double> monthlyRevenue = new HashMap<>();
        for (Rent r : rents) {
            if ("paid".equalsIgnoreCase(r.getStatus())) {
                monthlyRevenue.put(r.getMonth(), monthlyRevenue.getOrDefault(r.getMonth(), 0.0) + r.getAmount());
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProperties", totalProperties);
        stats.put("occupiedProperties", occupiedProperties);
        stats.put("availableProperties", totalProperties - occupiedProperties);
        stats.put("totalRevenue", totalRevenue);
        stats.put("maintenanceStatus", maintenanceStatus);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("activeTenants", leases.stream()
                .filter(l -> "active".equalsIgnoreCase(l.getStatus()))
                .map(Lease::getTenantId)
                .filter(id -> id != null && !id.isBlank())
                .distinct()
                .count());
        stats.put("pendingApplications", applications.stream()
                .filter(a -> "under_review".equalsIgnoreCase(a.getStatus()))
                .count());

        return stats;
    }


    public Map<String, Object> getCustomerStats(String userId) {

        List<Lease> leases = leaseRepository.findByTenantId(userId);
        long activeLeases = leases.stream().filter(l -> "active".equalsIgnoreCase(l.getStatus())).count();

        List<Rent> rents = rentRepository.findByTenantId(userId);
        double totalPaid = rents.stream()
                .filter(r -> "paid".equalsIgnoreCase(r.getStatus()))
                .mapToDouble(Rent::getAmount)
                .sum();

        List<MaintenanceRequest> requests = maintenanceRequestRepo.findByTenantId(userId);
        Map<String, Integer> maintenanceStatus = new HashMap<>();

        for (MaintenanceRequest r : requests) {
            String status = r.getStatus();
            if (status != null) {
                maintenanceStatus.put(status, maintenanceStatus.getOrDefault(status, 0) + 1);
            }
        }

        Map<String, Double> monthlyExpense = new HashMap<>();
        for (Rent r : rents) {
            if ("paid".equalsIgnoreCase(r.getStatus())) {
                monthlyExpense.put(r.getMonth(), monthlyExpense.getOrDefault(r.getMonth(), 0.0) + r.getAmount());
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeLeases", activeLeases);
        stats.put("totalPaid", totalPaid);
        stats.put("maintenanceStatus", maintenanceStatus);
        stats.put("monthlyExpense", monthlyExpense);

        return stats;
    }
}
