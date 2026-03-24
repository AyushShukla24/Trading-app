package com.TradingApp.TradingApp.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    private String username;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    @Size(max = 100, message = "Email must be less than 100 characters.")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @Size(min = 6, max = 6, message = "OTP should be 6 digits.")
    private String otp;

    private boolean isVerified = false;
    private boolean isEkycCompleted=false;

    @Size(min = 10, max = 10, message = "Phone number must be 10 digits.")
    private String phoneNumber; // New field for phone number
}
