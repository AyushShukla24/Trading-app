package com.TradingApp.TradingApp.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.TradingApp.TradingApp.Models.ContactUsForm;
import com.TradingApp.TradingApp.Services.ContactFormService;
import com.TradingApp.TradingApp.Services.UserService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api")
public class ContactFormController {

    @Autowired ContactFormService contactFormService;
    @Autowired UserService user;

    @PostMapping("/contact-us")
    public ResponseEntity<?> contactUs(@RequestBody ContactUsForm formData){
    contactFormService.register(formData);
    return ResponseEntity.ok(Map.of("message","saved Successfully"));
    }    
}
