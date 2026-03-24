package com.TradingApp.TradingApp.Controller;

import com.TradingApp.TradingApp.Models.WishlistCrypto;
import com.TradingApp.TradingApp.Services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
@RestController
public class WishlistCryptoController {

    @Autowired
    private WishlistService stockService;

    @GetMapping("/wishlist")
    public ResponseEntity<List<WishlistCrypto>> getAllWishlistStocks() {
        List<WishlistCrypto> wishlist = stockService.getAllWishlistStocks();
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/wishlist")
    public ResponseEntity<WishlistCrypto> addToWishlist(@RequestBody WishlistCrypto stock) {
        System.out.println("Adding stock to wishlist: " + stock);
        stock.setIsBookmarked(true);
        stock.setStockId(stock.getId());
        WishlistCrypto savedStock = stockService.saveStock(stock);
        return ResponseEntity.ok(savedStock);
    }

    @GetMapping("/wishlist/{name}")
    public ResponseEntity<WishlistCrypto> getStockByName(@PathVariable String name) {
        Optional<WishlistCrypto> stock = stockService.getStockByName(name);
        return stock.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/wishlist/{name}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable String name) {
        System.out.println("Removing stock from wishlist: " + name);
        stockService.removeStockByName(name);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WishlistCrypto> getStockById(@PathVariable String id) {
        Optional<WishlistCrypto> stock = stockService.getStockById(id);
        return stock.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}