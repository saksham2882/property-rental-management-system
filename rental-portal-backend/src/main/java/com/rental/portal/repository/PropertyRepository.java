package com.rental.portal.repository;

import com.rental.portal.model.Property;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PropertyRepository extends MongoRepository<Property, String> {

    List<Property> findByCity(String city);
}
