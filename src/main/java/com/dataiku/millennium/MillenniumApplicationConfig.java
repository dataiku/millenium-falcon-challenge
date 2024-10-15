package com.dataiku.millennium;

import com.dataiku.millennium.model.config.MillenniumConfig;
import com.dataiku.millennium.controller.GraphController;
import com.dataiku.millennium.core.GraphService;
import com.dataiku.millennium.util.ObjectMapperFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;

@Configuration
@EnableJpaRepositories(basePackages = "com.dataiku.millennium.db")
@Import({MillenniumConfig.class, GraphController.class, GraphService.class})
public class MillenniumApplicationConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return ObjectMapperFactory.getObjectMapper();
    }

    @Bean
    public DataSource dataSource(MillenniumConfig config) throws URISyntaxException {
        URL resource = MilleniumApplication.class.getClassLoader().getResource(config.routesDb());
        String path = new File(resource.toURI()).getAbsolutePath();

        final DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(String.format("jdbc:sqlite:%s",path));
        return dataSource;
    }
}