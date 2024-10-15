package com.dataiku.millennium.model.config;

import com.dataiku.millennium.model.GraphProperties;
import com.dataiku.millennium.util.JsonPropertySourceFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;

@PropertySource(
        value = "classpath:millennium-falcon.json",
        factory = JsonPropertySourceFactory.class
)
@ConfigurationProperties
public class MillenniumConfig {
    private int autonomy;
    private String departure;
    private String arrival;
    private String routesDb;

    public void setAutonomy(int autonomy) {
        this.autonomy = autonomy;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public void setRoutesDb(String routesDb) {
        this.routesDb = routesDb;
    }

    public int autonomy() {
        return autonomy;
    }

    public String departure() {
        return departure;
    }

    public String arrival() {
        return arrival;
    }

    public String routesDb() {
        return routesDb;
    }

    public GraphProperties getGraphProperties() {
        return new GraphProperties(autonomy, departure, arrival);
    }
}
