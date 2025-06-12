package com.techie.microservices.inventory.repository;

import com.techie.microservices.inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

//@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    boolean existsBySkuCodeAndQuantityIsGreaterThanEqual(String skuCode, Integer quantity);
//    List<Inventory> findInventoryByQuantity(Integer quantity);

    @Modifying
    @Query("UPDATE Inventory i SET i.quantity = i.quantity - :quantity WHERE i.skuCode = :skuCode AND i.quantity >= :quantity")
    int subtractQuantity(@Param("skuCode") String skuCode, @Param("quantity") Integer quantity); // returns number of rows updated

    Optional<Inventory> findBySkuCode(String skuCode);
}

