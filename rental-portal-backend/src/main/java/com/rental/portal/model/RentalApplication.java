package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document(collection = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalApplication {

    @Id
    private String id;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String moveInDate;
    private Double monthlyIncome;
    private Integer occupants;
    private String message;
    private String propertyId;
    private String customerId;

    @Builder.Default
    private List<String> documents = new ArrayList<>();

    private String status;
    private String appliedAt;
}
