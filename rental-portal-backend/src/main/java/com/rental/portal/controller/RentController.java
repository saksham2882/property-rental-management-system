package com.rental.portal.controller;

import org.openpdf.text.DocumentException;
import com.rental.portal.model.Rent;
import com.rental.portal.service.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/rents")
public class RentController {

    @Autowired
    private RentService rentService;


    @GetMapping
    public ResponseEntity<List<Rent>> getRents(
            @RequestParam(required = false) String tenantId,
            @RequestParam(required = false) String status
        ) {
        return ResponseEntity.ok(rentService.getRents(tenantId, status));
    }


    @PostMapping
    public ResponseEntity<Rent> createRent(@RequestBody Rent rent) {
        Rent result = rentService.createRent(rent);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> updateRent(@PathVariable String id, @RequestBody Rent statusData) {
        Optional<Rent> result = rentService.updateRent(id, statusData);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payRent(@PathVariable String id) {
        try {
            Optional<Rent> result = rentService.payRentMock(id);
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rent record not found");
        } 
        catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/{id}/order")
    public ResponseEntity<?> initiateRazorpayOrder(@PathVariable String id) {
        try {
            Map<String, Object> response = rentService.initiateRazorpayOrder(id);
            return ResponseEntity.ok(response);
        } 
        catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } 
        catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } 
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initiate payment: " + e.getMessage());
        }
    }


    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verifyRazorpayPayment(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            Rent rent = rentService.verifyRazorpayPayment(id, payload);
            return ResponseEntity.ok(rent);
        } 
        catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } 
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable String id) {
        try {
            byte[] pdfBytes = rentService.downloadInvoice(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "receipt_" + id + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } 
        catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } 
        catch (DocumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
