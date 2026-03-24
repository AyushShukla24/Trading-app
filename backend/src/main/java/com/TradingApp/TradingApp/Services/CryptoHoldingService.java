package com.TradingApp.TradingApp.Services;

import com.TradingApp.TradingApp.Models.CryptoHolding;
import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Repository.CryptoHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CryptoHoldingService {

    @Autowired
    private CryptoHoldingRepository cryptoHoldingRepository;

    public void saveCryptoHolding(User user, String symbol, String name, BigDecimal purchasePrice, BigDecimal quantity, BigDecimal profitLoss) {
        CryptoHolding cryptoHolding = new CryptoHolding();
        cryptoHolding.setUser(user);
        cryptoHolding.setSymbol(symbol);
        cryptoHolding.setName(name);
        cryptoHolding.setPurchasePrice(purchasePrice);
        cryptoHolding.setQuantity(quantity);
        cryptoHolding.setTotalUnit(quantity.multiply(purchasePrice));
        cryptoHolding.setPurchaseDate(java.time.LocalDate.now());
        cryptoHolding.setProfitLoss(profitLoss);
        cryptoHoldingRepository.save(cryptoHolding);
    }
    public CryptoHolding findByUserAndSymbol(User user, String symbol) {
        return cryptoHoldingRepository.findByUserAndSymbol(user, symbol).orElse(null);
    }

    public void updateCryptoHolding(CryptoHolding holding) {
        cryptoHoldingRepository.save(holding);
    }     
}
