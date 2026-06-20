package com.rental.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class RentalPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalPortalApplication.class, args);
	}
}
