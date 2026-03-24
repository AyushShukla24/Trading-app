package com.TradingApp.TradingApp.Repository;

import com.TradingApp.TradingApp.Models.CryptoHolding;
import com.TradingApp.TradingApp.Models.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CryptoHoldingRepository extends JpaRepository<CryptoHolding, Long> {
    List<CryptoHolding> findByUser(User user);
    @Query("SELECT c FROM CryptoHolding c WHERE c.user = :user AND c.symbol = :symbol")
    Optional<CryptoHolding> findByUserAndSymbol(@Param("user") User user, @Param("symbol") String symbol);
}