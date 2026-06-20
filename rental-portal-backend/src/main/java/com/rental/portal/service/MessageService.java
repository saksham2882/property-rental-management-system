package com.rental.portal.service;

import com.rental.portal.model.Message;
import com.rental.portal.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;


    public List<Message> getChatHistory(String user1, String user2) {
        return messageRepository.findChatHistory(user1, user2);
    }


    public Message sendMessage(Message message) {
        message.setId(UUID.randomUUID().toString().substring(0, 8));
        message.setTimestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        return messageRepository.save(message);
    }


    public List<Message> getReceivedMessages(String receiverId) {
        return messageRepository.findByReceiverId(receiverId);
    }
}
