package com.rental.portal.service;

import com.rental.portal.model.Notification;
import com.rental.portal.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;


    public List<Notification> getNotifications(String userId) {
        if (userId != null) {
            return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return notificationRepository.findAll();
    }


    public Notification createNotification(Notification notification) {
        notification.setId(UUID.randomUUID().toString().substring(0, 8));
        notification.setCreatedAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX").format(new Date()));
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        return notificationRepository.save(notification);
    }


    public Optional<Notification> markAsRead(String id, Boolean isRead) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isEmpty()) {
            return Optional.empty();
        }

        Notification notification = notifOpt.get();
        if (isRead != null) {
            notification.setIsRead(isRead);
        }

        return Optional.of(notificationRepository.save(notification));
    }
}
