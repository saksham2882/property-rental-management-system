package com.rental.portal.service;

import org.json.JSONObject;
import org.openpdf.text.DocumentException;

import com.rental.portal.exception.BadRequestException;
import com.rental.portal.exception.ConflictException;
import com.rental.portal.exception.ResourceNotFoundException;
import com.rental.portal.model.*;
import com.rental.portal.repository.*;
import com.rental.portal.util.PdfGenerationService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class RentService {

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private RazorpayClient razorpayClient;


    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;


    public List<Rent> getRents(String tenantId, String status) {
        if (tenantId != null && status != null) {
            return rentRepository.findByTenantIdAndStatus(tenantId, status);
        }
        if (tenantId != null) {
            return rentRepository.findByTenantId(tenantId);
        }
        if (status != null) {
            return rentRepository.findByStatus(status);
        }
        return rentRepository.findAll();
    }


    public Optional<Rent> getRentById(String id) {
        return rentRepository.findById(id);
    }


    public Rent createRent(Rent rent) {
        rent.setId(UUID.randomUUID().toString().substring(0, 8));
        if (rent.getStatus() == null) {
            rent.setStatus("pending");
        }
        return rentRepository.save(rent);
    }


    public Optional<Rent> updateRent(String id, Rent statusData) {
        Optional<Rent> rentOpt = rentRepository.findById(id);
        if (rentOpt.isEmpty()) {
            return Optional.empty();
        }

        Rent rent = rentOpt.get();
        if (statusData.getStatus() != null) rent.setStatus(statusData.getStatus());
        if (statusData.getPaidDate() != null) rent.setPaidDate(statusData.getPaidDate());

        return Optional.of(rentRepository.save(rent));
    }


    public Optional<Rent> payRentMock(String id) {
        Optional<Rent> rentOpt = rentRepository.findById(id);
        if (rentOpt.isEmpty()) {
            return Optional.empty();
        }

        Rent rent = rentOpt.get();
        if ("paid".equalsIgnoreCase(rent.getStatus())) {
            throw new ConflictException("Rent already settled");
        }

        rent.setStatus("paid");
        rent.setPaidDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        rent.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return Optional.of(rentRepository.save(rent));
    }


    public Map<String, Object> initiateRazorpayOrder(String id) throws Exception {
        Optional<Rent> rentOpt = rentRepository.findById(id);
        if (rentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Rent record not found");
        }

        Rent rent = rentOpt.get();
        if ("paid".equalsIgnoreCase(rent.getStatus())) {
            throw new ConflictException("Rent already settled");
        }

        // Cap the amount to 45,000 INR for testing to prevent Razorpay test-mode transaction limit failures (max 50,000 INR)
        double allowedAmount = Math.min(rent.getAmount(), 45000.0);
        int amountInPaise = (int) (allowedAmount * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", rent.getId());

        Order order = razorpayClient.orders.create(orderRequest);

        String orderId = order.get("id");
        rent.setRazorpayOrderId(orderId);
        rentRepository.save(rent);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", orderId);
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);

        return response;
    }


    public Rent verifyRazorpayPayment(String id, Map<String, String> payload) {
        Optional<Rent> rentOpt = rentRepository.findById(id);
        if (rentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Rent record not found");
        }

        Rent rent = rentOpt.get();
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        if (razorpayPaymentId == null) {
            razorpayPaymentId = payload.get("razorpayPaymentId");
        }

        String razorpayOrderId = payload.get("razorpay_order_id");
        if (razorpayOrderId == null) {
            razorpayOrderId = payload.get("razorpayOrderId");
        }

        String razorpaySignature = payload.get("razorpay_signature");
        if (razorpaySignature == null) {
            razorpaySignature = payload.get("razorpaySignature");
        }

        if (razorpayPaymentId == null || razorpayOrderId == null || razorpaySignature == null) {
            throw new BadRequestException("Missing Razorpay payment parameters");
        }

        boolean isSignatureValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, razorpayKeySecret);
        if (!isSignatureValid) {
            throw new BadRequestException("Invalid payment signature");
        }

        rent.setStatus("paid");
        rent.setPaidDate(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        rent.setTransactionId(razorpayPaymentId);
        rent.setRazorpayPaymentId(razorpayPaymentId);
        rent.setRazorpayOrderId(razorpayOrderId);
        rent.setRazorpaySignature(razorpaySignature);

        Rent savedRent = rentRepository.save(rent);

        String tenantName = "Valued Tenant";
        Optional<User> userOpt = userRepository.findById(rent.getTenantId());
        if (userOpt.isPresent()) {
            tenantName = userOpt.get().getName();
        }

        Notification customerNotif = Notification.builder()
                                        .id(UUID.randomUUID().toString().substring(0, 8))
                                        .userId(rent.getTenantId())
                                        .title("Rent Paid Successfully")
                                        .message("Your rent payment of INR " + rent.getAmount() + " for " + rent.getMonth() + " has been successfully processed via Razorpay. Transaction ID: " + razorpayPaymentId)
                                        .type("success")
                                        .isRead(false)
                                        .createdAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                                        .build();
        notificationRepository.save(customerNotif);

        Notification adminNotif = Notification.builder()
                                    .id(UUID.randomUUID().toString().substring(0, 8))
                                    .userId("1")
                                    .title("Rent Paid (Razorpay)")
                                    .message("Tenant " + tenantName + " has paid rent of INR " + rent.getAmount() + " for " + rent.getMonth() + " via Razorpay. Txn ID: " + razorpayPaymentId)
                                    .type("success")
                                    .isRead(false)
                                    .createdAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                                    .build();
        notificationRepository.save(adminNotif);

        return savedRent;
    }


    public byte[] downloadInvoice(String id) throws DocumentException, IOException {
        Optional<Rent> rentOpt = rentRepository.findById(id);
        if (rentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Rent record not found");
        }

        Rent rent = rentOpt.get();
        User tenant = userRepository.findById(rent.getTenantId()).orElse(null);
        Lease lease = leaseRepository.findById(rent.getLeaseId()).orElse(null);
        Property property = null;
        if (lease != null) {
            property = propertyRepository.findById(lease.getPropertyId()).orElse(null);
        }

        return pdfGenerationService.generateRentInvoice(rent, tenant, lease, property);
    }


    private boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String data = orderId + "|" + paymentId;
            Mac m = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256");
            m.init(secretKey);

            byte[] hash = m.doFinal(data.getBytes("UTF-8"));
            
            StringBuilder hexStr = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexStr.append('0');
                hexStr.append(hex);
            }
            
            return hexStr.toString().equals(signature);

        } catch (Exception e) {
            return false;
        }
    }
}
