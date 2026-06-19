package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rent {

    @Id
    private String id;
    private String leaseId;
    private String tenantId;
    private String month;
    private Double amount;
    private String dueDate;
    private String paidDate;
    private String status;
    private String transactionId;
    
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
