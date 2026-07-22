package com.rental.portal.service;

import com.rental.portal.model.Property;
import com.rental.portal.model.Review;
import com.rental.portal.repository.PropertyRepository;
import com.rental.portal.repository.ReviewRepository;
import com.rental.portal.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.rental.portal.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;


    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUser().getId();
        }
        return null;
    }


    public List<Property> getProperties(String city, String type, Integer bedrooms, String furnishing, Boolean available, Double rentMin, Double rentMax, Integer areaMin, Integer areaMax, String search, String ownerId) {
        Query query = new Query();

        if (city != null && !city.isEmpty()) {
            query.addCriteria(Criteria.where("city").regex("^" + city + "$", "i"));
        }
        if (type != null && !type.isEmpty()) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (bedrooms != null) {
            query.addCriteria(Criteria.where("bedrooms").is(bedrooms));
        }
        if (furnishing != null && !furnishing.isEmpty()) {
            query.addCriteria(Criteria.where("furnishing").is(furnishing));
        }
        if (available != null) {
            query.addCriteria(Criteria.where("available").is(available));
        }

        if (rentMin != null || rentMax != null) {
            Criteria rentCriteria = Criteria.where("rent");
            if (rentMin != null) rentCriteria.gte(rentMin);
            if (rentMax != null) rentCriteria.lte(rentMax);
            query.addCriteria(rentCriteria);
        }

        if (areaMin != null || areaMax != null) {
            Criteria areaCriteria = Criteria.where("area");
            if (areaMin != null) areaCriteria.gte(areaMin);
            if (areaMax != null) areaCriteria.lte(areaMax);
            query.addCriteria(areaCriteria);
        }

        if (search != null && !search.isEmpty()) {
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("locality").regex(search, "i"),
                    Criteria.where("description").regex(search, "i")
            );
            query.addCriteria(searchCriteria);
        }

        if (ownerId != null && !ownerId.isEmpty()) {
            query.addCriteria(Criteria.where("ownerId").is(ownerId));
        }

        List<Property> properties = mongoTemplate.find(query, Property.class);
        populateOwnerNames(properties);
        return properties;
    }

    private void populateOwnerNames(List<Property> properties) {
        for (Property p : properties) {
            if (p.getOwnerId() != null) {
                userRepository.findById(p.getOwnerId()).ifPresent(u -> p.setOwnerName(u.getName()));
            }
        }
    }


    public Optional<Property> getPropertyById(String id) {
        Optional<Property> prop = propertyRepository.findById(id);
        prop.ifPresent(p -> {
            if (p.getOwnerId() != null) {
                userRepository.findById(p.getOwnerId()).ifPresent(u -> p.setOwnerName(u.getName()));
            }
        });
        return prop;
    }


    public Property createProperty(Property property) {
        property.setId(UUID.randomUUID().toString().substring(0, 8));
        property.setPostedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        if (property.getAvailable() == null) {
            property.setAvailable(true);
        }

        String currentUserId = getCurrentUserId();
        if (currentUserId != null) {
            property.setOwnerId(currentUserId);
            userRepository.findById(currentUserId).ifPresent(u -> property.setOwnerName(u.getName()));
        }
        return propertyRepository.save(property);
    }


    public Optional<Property> updateProperty(String id, Property updateData) {
        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return Optional.empty();
        }

        Property property = propOpt.get();
        String currentUserId = getCurrentUserId();
        if (currentUserId != null && !currentUserId.equals(property.getOwnerId())) {
            throw new AccessDeniedException("You do not own this property");
        }

        if (updateData.getTitle() != null) property.setTitle(updateData.getTitle());
        if (updateData.getCity() != null) property.setCity(updateData.getCity());
        if (updateData.getLocality() != null) property.setLocality(updateData.getLocality());
        if (updateData.getType() != null) property.setType(updateData.getType());
        if (updateData.getBedrooms() != null) property.setBedrooms(updateData.getBedrooms());
        if (updateData.getBathrooms() != null) property.setBathrooms(updateData.getBathrooms());
        if (updateData.getRent() != null) property.setRent(updateData.getRent());
        if (updateData.getDeposit() != null) property.setDeposit(updateData.getDeposit());
        if (updateData.getFurnishing() != null) property.setFurnishing(updateData.getFurnishing());
        if (updateData.getAvailable() != null) property.setAvailable(updateData.getAvailable());
        if (updateData.getAvailableFrom() != null) property.setAvailableFrom(updateData.getAvailableFrom());
        if (updateData.getArea() != null) property.setArea(updateData.getArea());
        if (updateData.getDescription() != null) property.setDescription(updateData.getDescription());
        if (updateData.getAmenities() != null) property.setAmenities(updateData.getAmenities());
        if (updateData.getImages() != null) property.setImages(updateData.getImages());

        return Optional.of(propertyRepository.save(property));
    }


    public boolean deleteProperty(String id) {
        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return false;
        }

        String currentUserId = getCurrentUserId();
        if (currentUserId != null && !currentUserId.equals(propOpt.get().getOwnerId())) {
            throw new AccessDeniedException("You do not own this property");
        }
        propertyRepository.deleteById(id);
        return true;
    }


    public List<Review> getPropertyReviews(String id) {
        return reviewRepository.findByPropertyId(id);
    }


    public Optional<Review> addPropertyReview(String id, Review review) {
        Optional<Property> propOpt = propertyRepository.findById(id);
        if (propOpt.isEmpty()) {
            return Optional.empty();
        }

        if (review.getRating() == null) {
            throw new IllegalArgumentException("Rating cannot be null");
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        review.setId(UUID.randomUUID().toString().substring(0, 8));
        review.setPropertyId(id);
        review.setCreatedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));

        Review savedReview = reviewRepository.save(review);

        Property property = propOpt.get();
        List<Review> reviews = reviewRepository.findByPropertyId(id);

        double avg = reviews.stream()
                .filter(r -> r.getRating() != null)
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        property.setAverageRating(Math.round(avg * 10.0) / 10.0);
        property.setTotalReviews(reviews.size());
        propertyRepository.save(property);

        return Optional.of(savedReview);
    }
}
