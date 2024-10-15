package com.dataiku.millennium.util;

import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Map;

public final class JsonPropertySourceFactory
        implements PropertySourceFactory {
    @Override
    @NonNull
    public PropertySource<?> createPropertySource(
            String name, EncodedResource resource)
            throws IOException {
        Map readValue = ObjectMapperFactory.getObjectMapper()
                .readValue(resource.getInputStream(), Map.class);
        return new MapPropertySource("json-property", readValue);
    }
}