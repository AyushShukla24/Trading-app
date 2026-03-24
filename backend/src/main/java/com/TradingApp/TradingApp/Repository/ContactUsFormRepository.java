package com.TradingApp.TradingApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.TradingApp.TradingApp.Models.ContactUsForm;


@Repository
public interface ContactUsFormRepository extends JpaRepository<ContactUsForm,Long>{
    
}
