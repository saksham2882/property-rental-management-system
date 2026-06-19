package com.rental.portal.repository;

import com.rental.portal.model.MaintenanceRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MaintenanceRequestRepository extends MongoRepository<MaintenanceRequest, String> {
}
