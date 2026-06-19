package com.rental.portal.service;

import com.rental.portal.model.MaintenanceRequest;
import com.rental.portal.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        if (tenantId != null) {
            return maintenanceRequestRepo.findByTenantId(tenantId);
        }
        return maintenanceRequestRepo.findAll();
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
