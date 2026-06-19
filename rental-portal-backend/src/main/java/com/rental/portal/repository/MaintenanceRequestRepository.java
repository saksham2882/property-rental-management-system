package com.rental.portal.repository;

import com.rental.portal.model.MaintenanceRequest;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MaintenanceRequestRepository extends MongoRepository<MaintenanceRequest, String> {

    List<MaintenanceRequest> findByTenantId(String tenantId);
}
