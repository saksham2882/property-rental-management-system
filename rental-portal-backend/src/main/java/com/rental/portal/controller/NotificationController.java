package com.rental.portal.controller;

import com.rental.portal.model.Notification;
import com.rental.portal.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;


    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam(required = false) String userId) {
        List<Notification> notifications = notificationService.getNotifications(userId);
        return ResponseEntity.ok(notifications);
    }


    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification result = notificationService.createNotification(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable String id, @RequestBody Notification statusData) {
        Optional<Notification> result = notificationService.markAsRead(id, statusData.getIsRead());
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }
}
