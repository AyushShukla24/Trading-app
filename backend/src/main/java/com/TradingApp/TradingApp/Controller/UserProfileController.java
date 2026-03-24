package com.TradingApp.TradingApp.Controller;

import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getUser(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> updateUserProfile(@Valid @RequestBody User updatedUser) {
        System.out.println("hool"+updatedUser);
        User existingUser = userRepository.findByEmail(updatedUser.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setEkycCompleted(true);
        userRepository.save(existingUser);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }
}
