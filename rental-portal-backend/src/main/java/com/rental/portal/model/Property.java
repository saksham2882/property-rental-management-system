package com.rental.portal.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    private String id;
    private String title;
    private String city;
    private String locality;
    private String type;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double rent;
    private Double deposit;
    private String furnishing;
    private Boolean available;
    private String availableFrom;
    private Integer area;
    private String description;

    @Builder.Default
    private List<String> amenities = new ArrayList<>();

    @Builder.Default
    private List<String> images = new ArrayList<>();
    
    private String ownerId;
    private String postedAt;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalReviews = 0;
}
