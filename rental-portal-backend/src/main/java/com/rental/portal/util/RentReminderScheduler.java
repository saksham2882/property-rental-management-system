package com.rental.portal.util;

import com.rental.portal.model.Rent;
import com.rental.portal.model.Notification;
import com.rental.portal.repository.RentRepository;
import com.rental.portal.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class RentReminderScheduler {

    @Autowired
    private RentRepository rentRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    @Scheduled(fixedRate = 300000)
    public void checkPendingRentsAndAlert() {

        log.info("Scheduler executing: scanning for unpaid rents...");

        List<Rent> pendingRents = rentRepository.findAll();

        for (Rent rent : pendingRents) {

            if ("pending".equalsIgnoreCase(rent.getStatus()) || "overdue".equalsIgnoreCase(rent.getStatus())) {
                String title = "Rent Due Reminder";
                String msg = "Your rent of ₹" + rent.getAmount() + " for " + rent.getMonth() + " is pending. Due date: " + rent.getDueDate();

                List<Notification> existing = notificationRepository.findByUserId(rent.getTenantId());
                boolean alertExists = existing.stream().anyMatch(n -> title.equals(n.getTitle()) && msg.equals(n.getMessage()));

                if (!alertExists) {
                    Notification alert = Notification.builder()
                            .id(UUID.randomUUID().toString().substring(0, 8))
                            .userId(rent.getTenantId())
                            .title(title)
                            .message(msg)
                            .type("info")
                            .isRead(false)
                            .createdAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                            .build();
                    notificationRepository.save(alert);
                    log.info("Created pending rent notification for user: " + rent.getTenantId());
                }
            }
        }
    }
}
