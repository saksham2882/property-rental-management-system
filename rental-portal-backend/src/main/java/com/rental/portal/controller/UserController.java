package com.rental.portal.controller;

import com.rental.portal.model.User;
import com.rental.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(userService.getAllUsers(role));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.user.id")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.user.id")
    public ResponseEntity<?> updateUserProfile(@PathVariable String id, @RequestBody User updateData) {
        return userService.updateUserProfile(id, updateData)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/wishlist/{propertyId}")
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.user.id")
    public ResponseEntity<?> addToWishlist(@PathVariable String userId, @PathVariable String propertyId) {
        if (userService.addToWishlist(userId, propertyId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}/wishlist/{propertyId}")
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.user.id")
    public ResponseEntity<?> removeFromWishlist(@PathVariable String userId, @PathVariable String propertyId) {
        if (userService.removeFromWishlist(userId, propertyId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
