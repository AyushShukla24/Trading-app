package com.TradingApp.TradingApp.Services;

import com.TradingApp.TradingApp.Models.WishlistCrypto;
import com.TradingApp.TradingApp.Repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {
    @Autowired
    private StockRepository stockRepositry;

    public WishlistCrypto saveStock(WishlistCrypto stock) {
        return stockRepositry.save(stock);
    }

    public Optional<WishlistCrypto> getStockByName(String name) {
        return stockRepositry.findByName(name);
    }

    @Transactional
    public void removeStockByName(String name) {
        stockRepositry.deleteByName(name);
    }

    public Optional<WishlistCrypto> getStockById(String id) {
        return stockRepositry.findById(id); 
    }

    public List<WishlistCrypto> getAllWishlistStocks() {
        return stockRepositry.findAllByIsBookmarked(true); 
    }
}
