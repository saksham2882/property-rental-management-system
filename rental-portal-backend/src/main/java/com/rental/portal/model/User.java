package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;
    private String phone;
    private String city;
    private List<String> preferredLocations;
    private Integer budgetMin;
    private Integer budgetMax;
    private String createdAt;
    private Boolean emailAlerts;
    private Boolean smsAlerts;

    @Builder.Default
    private Set<String> wishlist = new HashSet<>();
}
