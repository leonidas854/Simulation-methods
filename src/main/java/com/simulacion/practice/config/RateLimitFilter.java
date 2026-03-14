package com.simulacion.practice.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class RateLimitFilter implements Filter {
    
 
    private final Map<String, Queue<Long>> requestCounts = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        if (req.getRequestURI().startsWith("/api/simulacion")) {
            String clientIp = req.getHeader("X-Forwarded-For");
                if (clientIp == null) {
                    clientIp = req.getRemoteAddr();
                }
            long currentTime = System.currentTimeMillis();

            requestCounts.putIfAbsent(clientIp, new ConcurrentLinkedQueue<>());
            Queue<Long> timestamps = requestCounts.get(clientIp);

            while (!timestamps.isEmpty() && currentTime - timestamps.peek() > 60000) {
                timestamps.poll();
            }

            if (timestamps.size() >= 30) {
                res.setStatus(429); 
                res.setContentType("application/json");
                res.getWriter().write("{\"error\": \"Has superado el límite de 30 peticiones por minuto. Espera un momento.\"}");
                return;
            }
            timestamps.add(currentTime);
        }
        
        chain.doFilter(request, response);
    }
}