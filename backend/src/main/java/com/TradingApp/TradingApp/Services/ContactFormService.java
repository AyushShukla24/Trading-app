package com.TradingApp.TradingApp.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.TradingApp.TradingApp.Models.ContactUsForm;
import com.TradingApp.TradingApp.Repository.ContactUsFormRepository;


@Service
public class ContactFormService {

    @Autowired
    private ContactUsFormRepository contactUsFormRepository;
    public ContactUsForm register(ContactUsForm formData){
        return contactUsFormRepository.save(formData);
    }
}
