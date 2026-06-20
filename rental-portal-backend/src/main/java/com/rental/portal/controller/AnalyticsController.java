package com.rental.portal.controller;

import com.rental.portal.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;


    @GetMapping("/admin")
    public ResponseEntity<?> getAdminStats() {
        Map<String, Object> stats = analyticsService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    
    @GetMapping("/customer/{userId}")
    public ResponseEntity<?> getCustomerStats(@PathVariable String userId) {
        Map<String, Object> stats = analyticsService.getCustomerStats(userId);
        return ResponseEntity.ok(stats);
    }
}
