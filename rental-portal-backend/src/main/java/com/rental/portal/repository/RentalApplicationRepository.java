package com.rental.portal.repository;

import com.rental.portal.model.RentalApplication;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RentalApplicationRepository extends MongoRepository<RentalApplication, String> {

    List<RentalApplication> findByCustomerId(String customerId);

    List<RentalApplication> findByPropertyId(String propertyId);

    List<RentalApplication> findByPropertyIdIn(List<String> propertyIds);
}
