package com.TradingApp.TradingApp.Repository;

import com.TradingApp.TradingApp.Models.WishlistCrypto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<WishlistCrypto, String> {
    Optional<WishlistCrypto> findByName(String name);
    void deleteByName(String name);
    List<WishlistCrypto> findAllByIsBookmarked(boolean isBookmarked);
}
