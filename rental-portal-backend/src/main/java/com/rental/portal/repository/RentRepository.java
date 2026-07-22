package com.rental.portal.repository;

import com.rental.portal.model.Rent;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface RentRepository extends MongoRepository<Rent, String> {
    
    List<Rent> findByTenantId(String tenantId);

    List<Rent> findByStatus(String status);

    List<Rent> findByTenantIdAndStatus(String tenantId, String status);

    List<Rent> findByLeaseIdIn(List<String> leaseIds);

    List<Rent> findByLeaseIdInAndStatus(List<String> leaseIds, String status);
}
