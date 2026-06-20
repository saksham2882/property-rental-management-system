package com.rental.portal.repository;

import com.rental.portal.model.Rent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RentRepository extends MongoRepository<Rent, String> {
    
}
