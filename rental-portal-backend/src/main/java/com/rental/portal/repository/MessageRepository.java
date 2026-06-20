package com.rental.portal.repository;

import com.rental.portal.model.Message;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface MessageRepository extends MongoRepository<Message, String> {

    // finds all messages between two users
    @Query("{ '$or': [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<Message> findChatHistory(String user1, String user2);
    
    List<Message> findByReceiverId(String receiverId);
}
