package com.rental.portal.repository;

import com.rental.portal.model.RentalApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RentalApplicationRepository extends MongoRepository<RentalApplication, String> {

}
