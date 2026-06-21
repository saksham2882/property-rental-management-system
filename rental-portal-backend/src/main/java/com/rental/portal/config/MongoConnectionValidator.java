package com.rental.portal.config;

import com.mongodb.client.MongoClient;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MongoConnectionValidator implements CommandLineRunner {

    @Autowired
    private MongoClient mongoClient;


    @Override
    public void run(String... args) throws Exception {
        System.out.println("=================================================");
        System.out.println("Validating MongoDB connection...");

        try {
            mongoClient.getDatabase("admin").runCommand(new Document("ping", 1));
            System.out.println("MongoDB Connection Status: SUCCESSFUL!");
            System.out.println("=================================================");
        } 
        
        catch (Exception e) {
            System.err.println("MongoDB Connection Status: FAILED!");
            System.err.println("Error details: " + e.getMessage());
            System.err.println("=================================================");
            throw new IllegalStateException("MongoDB connection validation failed. Please check your connection URI and credentials.", e);
        }
    }
}
