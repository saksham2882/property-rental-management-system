package com.rental.portal.controller;

import com.rental.portal.model.Lease;
import com.rental.portal.service.LeaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/leases")
public class LeaseController {

    @Autowired
    private LeaseService leaseService;


    @GetMapping
    public ResponseEntity<List<Lease>> getLeases(@RequestParam(required = false) String tenantId) {
        List<Lease> leases = leaseService.getLeases(tenantId);
        return ResponseEntity.ok(leases);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Lease> getById(@PathVariable String id) {
        return leaseService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<Lease> createLease(@RequestBody Lease lease) {
        Lease result = leaseService.createLease(lease);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> updateLease(@PathVariable String id, @RequestBody Lease updateData) {
        Optional<Lease> result = leaseService.updateLease(id, updateData);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/{id}/sign")
    public ResponseEntity<?> signLease(@PathVariable String id, @RequestBody Map<String, String> payload) {

        String signatureBase64 = payload.get("signatureImage");
        if (signatureBase64 == null || signatureBase64.isEmpty()) {
            return ResponseEntity.badRequest().body("Signature data is required");
        }

        Optional<Lease> result = leaseService.signLease(id, signatureBase64);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }
}
