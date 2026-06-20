package com.rental.portal.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@Slf4j
public class ApiLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String uri = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = request.getRemoteAddr();
        String queryString = request.getQueryString();

        String requestDetails = queryString != null ? uri + "?" + queryString : uri;
        log.info(">>> Incoming HTTP {} | IP: {} | Path: {}", method, clientIp, requestDetails);

        try {
            filterChain.doFilter(request, response);
        } 
        finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            log.info("<<< Outgoing HTTP Status: {} | Path: {} | Time: {}ms", status, uri, duration);
        }
    }
}
