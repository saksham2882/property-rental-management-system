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


    public Map<String, Object> getAdminStats() {
        long totalProperties = propertyRepository.count();
        
        List<Property> properties = propertyRepository.findAll();
        long occupiedProperties = properties.stream().filter(p -> Boolean.FALSE.equals(p.getAvailable())).count();

        List<Rent> rents = rentRepository.findAll();
        double totalRevenue = rents.stream()
                .filter(r -> "paid".equalsIgnoreCase(r.getStatus()))
                .mapToDouble(Rent::getAmount)
                .sum();

        List<MaintenanceRequest> requests = maintenanceRequestRepo.findAll();
        Map<String, Integer> maintenanceStatus = new HashMap<>();
        maintenanceStatus.put("Open", 0);
        maintenanceStatus.put("In Progress", 0);
        maintenanceStatus.put("Resolved", 0);

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
        stats.put("totalRevenue", totalRevenue);
        stats.put("maintenanceStatus", maintenanceStatus);
        stats.put("monthlyRevenue", monthlyRevenue);

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
        maintenanceStatus.put("Open", 0);
        maintenanceStatus.put("In Progress", 0);
        maintenanceStatus.put("Resolved", 0);

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
