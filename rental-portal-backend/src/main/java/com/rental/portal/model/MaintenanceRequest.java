package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document(collection = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {

    @Id
    private String id;
    private String category;
    private String description;
    private String urgency;
    private String propertyId;
    private String tenantId;
    private String status;
    private String raisedAt;
    private String resolvedAt;
    private String adminNote;

    @Builder.Default
    private List<String> images = new ArrayList<>();
}
