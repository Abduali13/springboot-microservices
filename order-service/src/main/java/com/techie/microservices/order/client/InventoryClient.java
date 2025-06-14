package com.techie.microservices.order.client;


import groovy.util.logging.Slf4j;
import org.slf4j.Logger;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;

//@FeignClient(name = "inventory", url = "${inventory.service.url}")  // Using rest client, so I have commented it
@Slf4j
public interface InventoryClient {

    Logger log = LoggerFactory.getLogger(InventoryClient.class);

//    @RequestMapping(method = RequestMethod.GET, value = "/api/inventory")  // Using rest client, so I have commented it
    @GetExchange("/api/inventory")
    @CircuitBreaker(name = "inventory", fallbackMethod = "fallbackMethod")
    @Retry(name = "inventory")
    boolean isInStock(@RequestParam String skuCode, @RequestParam Integer quantity);

    default boolean fallbackMethod(String code, Integer quantity, Throwable throwable){
        log.info("Cannot get inventory for skuCode {}, failure reason: {}", code, throwable.getMessage());
        return false;
    }
}
