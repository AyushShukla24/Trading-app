package com.TradingApp.TradingApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
// @NoArgsConstructor
@AllArgsConstructor
public class CryptoHoldingDTO {
    private Long id;
    private String name;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private String purchaseDate;
}
