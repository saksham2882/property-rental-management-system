package com.rental.portal.controller;

import com.rental.portal.model.MaintenanceRequest;
import com.rental.portal.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenanceRequests")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<List<MaintenanceRequest>> getRequests(@RequestParam(required = false) String tenantId) {
        List<MaintenanceRequest> requests = maintenanceService.getRequests(tenantId);
        return ResponseEntity.ok(requests);
    }


    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MaintenanceRequest> submitRequest(@RequestBody MaintenanceRequest request) {
        MaintenanceRequest result = maintenanceService.submitRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<MaintenanceRequest> updateRequest(@PathVariable String id, @RequestBody MaintenanceRequest updateData) {
        return maintenanceService.updateRequest(id, updateData)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
