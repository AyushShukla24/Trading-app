package com.TradingApp.TradingApp.Controller;

import com.TradingApp.TradingApp.Models.CryptoHolding;
import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Services.CryptoHoldingService;
import com.TradingApp.TradingApp.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CryptoHoldingController {

    @Autowired
    private CryptoHoldingService cryptoHoldingService;

    @Autowired
    private UserService userService;  
    @PostMapping("/buy")
    public ResponseEntity<?> buyCrypto(@RequestBody Map<String, Object> request) {
        try {
            String userEmail = request.get("userEmail").toString();
            String symbol = request.get("symbol").toString();
            String name = request.get("name").toString();
            BigDecimal purchasePrice = new BigDecimal(request.get("purchasePrice").toString());
            BigDecimal quantity = new BigDecimal(request.get("quantity").toString());
            BigDecimal profitLoss = new BigDecimal(request.get("profitLoss").toString());
    
          
            if (userEmail == null || symbol == null || name == null 
                    || purchasePrice.compareTo(BigDecimal.ZERO) <= 0 
                    || quantity.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid data provided."));
            }
    
          
            User user = userService.findByEmail(userEmail);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
            }
    
           
            CryptoHolding existingHolding = cryptoHoldingService.findByUserAndSymbol(user, symbol);
            if (existingHolding != null) {
                BigDecimal newQuantity = existingHolding.getQuantity().add(quantity);
    
                BigDecimal totalCost = existingHolding.getPurchasePrice().multiply(existingHolding.getQuantity())
                        .add(purchasePrice.multiply(quantity));
                @SuppressWarnings("deprecation")
                BigDecimal newAveragePurchasePrice = totalCost.divide(newQuantity, BigDecimal.ROUND_HALF_UP);
    
                existingHolding.setQuantity(newQuantity);
                existingHolding.setPurchasePrice(newAveragePurchasePrice);
    
                cryptoHoldingService.updateCryptoHolding(existingHolding);
            } else {
                cryptoHoldingService.saveCryptoHolding(user, symbol, name, purchasePrice, quantity, profitLoss);
            }
    
            return ResponseEntity.ok(Map.of("message", "Crypto purchase processed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error processing purchase: " + e.getMessage()));
        }
    }    
    }