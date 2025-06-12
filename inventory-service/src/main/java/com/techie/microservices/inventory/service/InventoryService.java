package com.techie.microservices.inventory.service;

import com.techie.microservices.inventory.model.Inventory;
import com.techie.microservices.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public boolean subtractQuantity(String skuCode, Integer requestedQuantity) {
        // Fetch inventory for the given SKU code
        Inventory inventory = inventoryRepository.findBySkuCode(skuCode)
                .orElseThrow(() -> new IllegalArgumentException("Product with SKU " + skuCode + " not found."));

        if (requestedQuantity <= 0) {
            log.warn("Requested quantity must be greater than zero. Requested quantity: {}", requestedQuantity);
            return false;
        }

        // Compare requested quantity with available stock
        if (inventory.getQuantity() < requestedQuantity) {
            log.warn("Insufficient stock for SKU {}. Available: {}, Requested: {}",
                    skuCode, inventory.getQuantity(), requestedQuantity);
            return false; // Not enough stock
        }

        // Subtract the requested quantity
        inventory.setQuantity(inventory.getQuantity() - requestedQuantity);
        inventoryRepository.save(inventory); // Persist the updated inventory

        log.info("Quantity successfully subtracted for SKU {}. Remaining stock: {}",
                skuCode, inventory.getQuantity());
        return true; // Successfully subtracted
    }
}