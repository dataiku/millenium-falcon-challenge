package com.dataiku.millenium.config;

import com.dataiku.millenium.core.Graph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphConfig {
    @Bean
    public Graph graph() {
        return new Graph(6, "Tatooine", "Endor");
    }
}