package com.rental.portal.repository;

import com.rental.portal.model.Lease;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface LeaseRepository extends MongoRepository<Lease, String> {

    List<Lease> findByTenantId(String tenantId);
}
