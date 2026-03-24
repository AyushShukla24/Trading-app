package com.TradingApp.TradingApp.Controller;

import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody User user) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered"));
        }
        userService.register(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody User user) {
        System.out.println("hello");
        Map<String, Object> response = new HashMap<>();
        try {
            User loggedInUser = userService.login(user.getEmail(), user.getPassword());
            response.put("message", "Login successful");
            response.put("username", loggedInUser.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("message", "Invalid credentials.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}