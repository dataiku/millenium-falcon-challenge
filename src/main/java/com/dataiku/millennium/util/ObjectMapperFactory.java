package com.dataiku.millennium.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;


public final class ObjectMapperFactory {
    // This is thread-safe.
    public static final ObjectMapper INSTANCE;

    static {
        INSTANCE = new ObjectMapper();
        INSTANCE.setPropertyNamingStrategy(new PropertyNamingStrategies.SnakeCaseStrategy());
    }

    private ObjectMapperFactory() {}

    public static ObjectMapper getObjectMapper() {
        return INSTANCE;
    }
}
