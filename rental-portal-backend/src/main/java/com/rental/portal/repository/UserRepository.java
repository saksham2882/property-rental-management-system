package com.rental.portal.repository;

import com.rental.portal.model.User;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(String role);
}
