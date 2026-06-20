package com.rental.portal.repository;

import com.rental.portal.model.Notification;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId);

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}
