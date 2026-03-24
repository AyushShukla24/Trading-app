package com.TradingApp.TradingApp.Models;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
public class WishlistCrypto {
    @Id
    private String id;  // primary key

    @Column(name = "symbol")
    private String symbol;

    @Column(name = "name")
    private String name;

    @Column(name = "is_bookmarked")
    private Boolean isBookmarked;

    @Column(name = "stock_id")
    private String stockId;

    @Column(name = "user_id") 
    private Long userId;

    @Column(name = "email") 
    private String email;
    
    // public void setUserId(Long userId) {
    //     this.userId = userId;
    // }

    // public String getEmail() {
    //     return email;
    // }
}
