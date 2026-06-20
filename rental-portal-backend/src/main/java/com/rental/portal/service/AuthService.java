package com.rental.portal.service;

import com.rental.portal.dto.AuthResponse;
import com.rental.portal.dto.LoginRequest;
import com.rental.portal.exception.ConflictException;
import com.rental.portal.model.User;
import com.rental.portal.repository.UserRepository;
import com.rental.portal.security.JwtTokenProvider;
import com.rental.portal.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;


    public AuthResponse authenticateUser(LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userPrincipal.getUser();
        user.setPassword(null);
        return new AuthResponse(jwt, user);
    }


    public AuthResponse registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ConflictException("Email address already in use.");
        }

        user.setId(UUID.randomUUID().toString().substring(0, 8));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("customer");
        user.setCreatedAt(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));

        User result = userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                new UserPrincipal(result), null, new UserPrincipal(result).getAuthorities());
        String jwt = tokenProvider.generateToken(authentication);

        result.setPassword(null);
        return new AuthResponse(jwt, result);
    }
}
