package com.rental.portal.controller;

import com.rental.portal.model.Message;
import com.rental.portal.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;


    @GetMapping
    public ResponseEntity<List<Message>> getChatHistory(
            @RequestParam String user1,
            @RequestParam String user2
        ) {
        List<Message> history = messageService.getChatHistory(user1, user2);
        return ResponseEntity.ok(history);
    }


    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message result = messageService.sendMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    
    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String receiverId) {
        List<Message> received = messageService.getReceivedMessages(receiverId);
        return ResponseEntity.ok(received);
    }
}
