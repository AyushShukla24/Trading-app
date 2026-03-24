package com.TradingApp.TradingApp.Services;

import ch.qos.logback.core.util.StringUtil;
import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(User user) throws IllegalArgumentException {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("Email already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

public User login(String email, String password) throws IllegalArgumentException {
    if (email == null || email.isEmpty()) {
        throw new IllegalArgumentException("Email cannot be empty.");
    }
    if (password == null || password.isEmpty()) {
        throw new IllegalArgumentException("Password cannot be empty.");
    }

    User user = userRepository.findByEmail(email);


    if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
        throw new IllegalArgumentException("Invalid credentials.");
    }

    return user;
}


    public String generateAndSendOtp(User user) {
        try {
            String otp = String.format("%06d", new Random().nextInt(999999));
            user.setOtp(otp);
            userRepository.save(user);
            sendOtpEmail(user.getEmail(), otp); 
            return otp;
        } catch (Exception e) {
            System.err.println("Error generating or sending OTP: " + e.getMessage());
            throw new RuntimeException("Failed to generate or send OTP.");
        }
    }


    private void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + otp);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email.");
        }
    }


    public boolean verifyOtp(User user, String otp) throws IllegalArgumentException {
        if (StringUtil.isNullOrEmpty(otp)) {
            throw new IllegalArgumentException("OTP cannot be empty.");
        }
        if (user.getOtp() == null) {
            throw new IllegalArgumentException("No OTP generated for this user.");
        }
        if (!user.getOtp().equals(otp)) {
            return false;
        }

        user.setVerified(true);
        user.setOtp(null);
        userRepository.save(user);
        return true;
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);  
    }
}
