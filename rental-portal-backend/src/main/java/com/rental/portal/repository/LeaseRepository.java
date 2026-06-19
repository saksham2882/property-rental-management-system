package com.rental.portal.repository;

import com.rental.portal.model.Lease;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeaseRepository extends MongoRepository<Lease, String> {
}
