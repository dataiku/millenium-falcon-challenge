package com.dataiku.millennium.cli.db;

import com.dataiku.millennium.cli.util.PathResolver;
import com.dataiku.millennium.db.entity.Route;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class RouteRepository {
    private static final Logger logger = Logger.getLogger(RouteRepository.class.getName());
    private final Connection connection;

    // Inject DatabaseConnector through the constructor
    public RouteRepository(Connection connection) {
        this.connection = connection;
    }

    public List<Route> getRoutesFromDB() {
        List<Route> routes = new ArrayList<>();
        String query = "SELECT origin, destination, travel_time FROM ROUTES";

        try (Statement mt = connection.createStatement();
             ResultSet results = mt.executeQuery(query)) {
            while (results.next()) {
                String origin = results.getString("origin");
                String destination = results.getString("destination");
                int travelTime = results.getInt("travel_time");
                routes.add(new Route(origin, destination, travelTime));
            }
        } catch (SQLException e) {
            logger.severe("Error while reading data from the database: " + e.getMessage());
        }

        return routes;
    }
}
