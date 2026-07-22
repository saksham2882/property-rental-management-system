package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "leases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lease {

    @Id
    private String id;
    private String applicationId;
    private String propertyId;
    private String tenantId;
    private String startDate;
    private String endDate;
    private Double monthlyRent;
    private Double deposit;
    private String status;
    private String conditions;
    private String propertyTitle;
    private String signatureImage;
    private String contractText;
    private String landlordName;
    private String createdAt;
}
