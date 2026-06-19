package com.rental.portal.repository;

import com.rental.portal.model.Review;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByPropertyId(String propertyId);
}
