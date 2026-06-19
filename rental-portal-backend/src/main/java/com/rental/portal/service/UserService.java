package com.rental.portal.service;

import com.rental.portal.model.User;
import com.rental.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public List<User> getAllUsers(String role) {
        if (role != null) {
            return userRepository.findByRole(role);
        }
        return userRepository.findAll();
    }


    public Optional<User> getUserById(String id) {
        return userRepository.findById(id).map(user -> {
            user.setPassword(null);
            return user;
        });
    }

    public Optional<User> updateUserProfile(String id, User updateData) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        if (updateData.getName() != null) user.setName(updateData.getName());
        if (updateData.getPhone() != null) user.setPhone(updateData.getPhone());
        if (updateData.getCity() != null) user.setCity(updateData.getCity());
        if (updateData.getPreferredLocations() != null) user.setPreferredLocations(updateData.getPreferredLocations());
        if (updateData.getBudgetMin() != null) user.setBudgetMin(updateData.getBudgetMin());
        if (updateData.getBudgetMax() != null) user.setBudgetMax(updateData.getBudgetMax());
        if (updateData.getEmailAlerts() != null) user.setEmailAlerts(updateData.getEmailAlerts());
        if (updateData.getSmsAlerts() != null) user.setSmsAlerts(updateData.getSmsAlerts());

        User saved = userRepository.save(user);
        saved.setPassword(null);
        return Optional.of(saved);
    }


    public boolean addToWishlist(String userId, String propertyId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        if (user.getWishlist() == null) {
            user.setWishlist(new HashSet<>());
        }
        
        user.getWishlist().add(propertyId);
        userRepository.save(user);
        return true;
    }


    public boolean removeFromWishlist(String userId, String propertyId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        if (user.getWishlist() != null) {
            user.getWishlist().remove(propertyId);
            userRepository.save(user);
        }
        return true;
    }
}
