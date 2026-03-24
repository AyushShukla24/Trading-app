package com.TradingApp.TradingApp.Controller;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.TradingApp.TradingApp.Models.CryptoHolding;
import com.TradingApp.TradingApp.Models.User;
import com.TradingApp.TradingApp.Repository.CryptoHoldingRepository;
import com.TradingApp.TradingApp.Services.CryptoHoldingService;
import com.TradingApp.TradingApp.Services.UserService;
import com.TradingApp.TradingApp.dto.CryptoHoldingDTO;


@RestController
@RequestMapping("/api")
public class CryptoPortfolioController {

    @Autowired
    private UserService userService;  

    @Autowired
    private CryptoHoldingRepository repository;

    @Autowired
    private CryptoHoldingService cryptoHoldingService;
        
    @GetMapping("/crypto-holdings")
    public ResponseEntity<List<CryptoHoldingDTO>> getHoldingsByEmail(@RequestParam String email) {
        System.out.println("ll");
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(List.of()); 
        }
     
        List<CryptoHolding> holdings = repository.findByUser(user);
    
       
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<CryptoHoldingDTO> holdingDTOs = holdings.stream().map(holding -> {
            BigDecimal currentPrice = calculateMockPrice(holding.getPurchasePrice());
            BigDecimal currentValue = currentPrice.multiply(holding.getQuantity());
    
            return new CryptoHoldingDTO(
                    holding.getId(),
                    holding.getName(),
                    holding.getSymbol(),
                    holding.getQuantity(),
                    holding.getPurchasePrice(),
                    currentPrice,
                    currentValue,
                    holding.getProfitLoss(),
                    holding.getPurchaseDate().format(formatter)
            );
        }).toList();
    
        return ResponseEntity.ok(holdingDTOs); 
    }    

    private BigDecimal calculateMockPrice(BigDecimal purchasePrice) {
        double fluctuation = (Math.random() * 0.4) - 0.2; 
        return purchasePrice.add(purchasePrice.multiply(BigDecimal.valueOf(fluctuation)));
    }

    @PostMapping("/update-holdings")
public ResponseEntity<?> updateHoldings(@RequestBody Map<String, Object> request) {
    try {
        String userEmail = request.get("userEmail").toString();
        String symbol = request.get("symbol").toString();
        BigDecimal currentPrice = new BigDecimal(request.get("currentPrice").toString());
        BigDecimal currentValue = new BigDecimal(request.get("currentValue").toString());

       
        User user = userService.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
        }

       
        CryptoHolding holding = cryptoHoldingService.findByUserAndSymbol(user, symbol);
        if (holding == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Holding not found."));
        }

      
        holding.setCurrentPrice(currentPrice);
        holding.setCurrentValue(currentValue);
        holding.setProfitLoss(currentValue.subtract(
                holding.getPurchasePrice().multiply(holding.getQuantity())));

        cryptoHoldingService.updateCryptoHolding(holding);

        return ResponseEntity.ok(Map.of("message", "Holdings updated successfully!"));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("message", "Error updating holdings: " + e.getMessage()));
    }
}
}
