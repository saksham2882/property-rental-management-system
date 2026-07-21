package com.rental.portal.service;

import com.rental.portal.model.*;
import com.rental.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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


    public Map<String, Object> getAdminStats() {
        List<Property> properties = propertyRepository.findAll();
        long totalProperties = properties.size();
        long occupiedProperties = properties.stream()
                .filter(p -> Boolean.FALSE.equals(p.getAvailable()))
                .count();

        List<Rent> rents = rentRepository.findAll();
        double totalRevenue = rents.stream()
                .filter(r -> "paid".equalsIgnoreCase(r.getStatus()))
                .mapToDouble(Rent::getAmount)
                .sum();

        List<MaintenanceRequest> requests = maintenanceRequestRepo.findAll();
        List<RentalApplication> applications = rentalApplicationRepository.findAll();
        List<Lease> leases = leaseRepository.findAll();
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
