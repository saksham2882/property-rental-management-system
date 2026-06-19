package com.rental.portal.controller;

import com.rental.portal.model.Property;
import com.rental.portal.model.Review;
import com.rental.portal.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;


    @GetMapping
    public ResponseEntity<List<Property>> getProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) String furnishing,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Double rentMin,
            @RequestParam(required = false) Double rentMax,
            @RequestParam(required = false) Integer areaMin,
            @RequestParam(required = false) Integer areaMax,
            @RequestParam(required = false) String search
        ) {
        List<Property> properties = propertyService.getProperties(
                city, type, bedrooms, furnishing, available, rentMin, rentMax, areaMin, areaMax, search
        );
        return ResponseEntity.ok(properties);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        return propertyService.getPropertyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        Property result = propertyService.createProperty(property);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Property> updateProperty(@PathVariable String id, @RequestBody Property updateData) {
        return propertyService.updateProperty(id, updateData)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProperty(@PathVariable String id) {
        if (propertyService.deleteProperty(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getPropertyReviews(@PathVariable String id) {
        List<Review> reviews = propertyService.getPropertyReviews(id);
        return ResponseEntity.ok(reviews);
    }


    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addPropertyReview(@PathVariable String id, @RequestBody Review review) {
        Optional<Review> result = propertyService.addPropertyReview(id, review);
        if (result.isPresent()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(result.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
    }
}
