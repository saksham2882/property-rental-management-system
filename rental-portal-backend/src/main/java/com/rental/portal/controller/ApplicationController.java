package com.rental.portal.controller;

import com.rental.portal.model.RentalApplication;
import com.rental.portal.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;


    @GetMapping
    public ResponseEntity<List<RentalApplication>> getApplications(
            @RequestParam(required = false) String customerId,
            @RequestParam(required = false) String propertyId
        ) {
        List<RentalApplication> applications = applicationService.getApplications(customerId, propertyId);
        return ResponseEntity.ok(applications);
    }


    @GetMapping("/{id}")
    public ResponseEntity<RentalApplication> getById(@PathVariable String id) {
        return applicationService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<RentalApplication> submitApplication(@RequestBody RentalApplication application) {
        RentalApplication result = applicationService.submitApplication(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody RentalApplication statusData) {
        java.util.Optional<RentalApplication> result = applicationService.updateStatus(id, statusData.getStatus());
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        if (applicationService.deleteApplication(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
