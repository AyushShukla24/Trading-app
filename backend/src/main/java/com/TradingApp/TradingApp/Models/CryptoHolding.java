package com.TradingApp.TradingApp.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@NoArgsConstructor
@Entity
@Data
public class CryptoHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String symbol;
    private String name;
    private BigDecimal purchasePrice;
    private BigDecimal totalUnit;
    private BigDecimal quantity;
    private LocalDate purchaseDate;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
}