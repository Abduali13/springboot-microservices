package com.programming.techie.api.config;

import org.springframework.boot.actuate.health.StatusAggregator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HealthIndicatorConfig {

    @Bean
    public StatusAggregator statusAggregator() {
        return StatusAggregator.getDefault();
    }
}
