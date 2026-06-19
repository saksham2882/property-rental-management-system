package com.rental.portal.service;

import com.rental.portal.model.RentalApplication;
import com.rental.portal.repository.RentalApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApplicationService {

    @Autowired
    private RentalApplicationRepository rentalAppRepo;


    public List<RentalApplication> getApplications(String customerId, String propertyId) {
        if (customerId != null) {
            return rentalAppRepo.findByCustomerId(customerId);
        }
        if (propertyId != null) {
            return rentalAppRepo.findByPropertyId(propertyId);
        }
        return rentalAppRepo.findAll();
    }


    public Optional<RentalApplication> getById(String id) {
        return rentalAppRepo.findById(id);
    }


    public RentalApplication submitApplication(RentalApplication application) {
        application.setId(UUID.randomUUID().toString().substring(0, 8));
        application.setAppliedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        application.setStatus("under_review");
        return rentalAppRepo.save(application);
    }


    public Optional<RentalApplication> updateStatus(String id, String status) {
        Optional<RentalApplication> appOpt = rentalAppRepo.findById(id);
        if (appOpt.isEmpty()) {
            return Optional.empty();
        }

        RentalApplication application = appOpt.get();
        if (status != null) {
            application.setStatus(status);
        }

        return Optional.of(rentalAppRepo.save(application));
    }


    public boolean deleteApplication(String id) {
        if (!rentalAppRepo.existsById(id)) {
            return false;
        }
        rentalAppRepo.deleteById(id);
        return true;
    }
}
