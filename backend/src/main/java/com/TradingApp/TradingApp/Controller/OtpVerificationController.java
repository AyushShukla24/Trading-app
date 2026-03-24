package com.TradingApp.TradingApp.Controller;

import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Repository.UserRepository;
import com.TradingApp.TradingApp.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/otp")
public class OtpVerificationController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@Valid @RequestBody User user) {
        // System.out.println("bbbbbbbbbbbbbbbbbbbbbbbbbthis"+user);
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userService.generateAndSendOtp(existingUser);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        boolean isVerified = userService.verifyOtp(existingUser, user.getOtp());
        if (isVerified) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid OTP"));
        }
    }
}
