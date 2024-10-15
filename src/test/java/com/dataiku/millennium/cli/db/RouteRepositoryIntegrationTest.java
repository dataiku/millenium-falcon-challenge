package com.dataiku.millennium.cli.db;

import com.dataiku.millennium.cli.db.RouteRepository;
import com.dataiku.millennium.db.entity.Route;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RouteRepositoryIntegrationTest {
    private RouteRepository routeRepository;
    private Connection connection;

    @BeforeEach
    void setUp() throws Exception {
        // Set up an in-memory SQLite database
        connection = DriverManager.getConnection("jdbc:sqlite::memory:");

        routeRepository = new RouteRepository(connection);

        // Create the ROUTES table and insert some test data
        try (Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE ROUTES (origin TEXT, destination TEXT, travel_time INTEGER)");
            statement.execute("INSERT INTO ROUTES (origin, destination, travel_time) VALUES ('Tatooine', 'Hoth', 5)");
            statement.execute("INSERT INTO ROUTES (origin, destination, travel_time) VALUES ('Endor', 'Naboo', 10)");
        }
    }

    @AfterEach
    void tearDown() throws Exception {
        connection.close();
    }

    @Test
    void testGetRoutesFromDB() {
        // Test using the in-memory SQLite database
        List<Route> routes = routeRepository.getRoutesFromDB();

        // Verify that the data is retrieved correctly
        assertEquals(2, routes.size());
        assertEquals("Tatooine", routes.get(0).origin());
        assertEquals("Hoth", routes.get(0).destination());
        assertEquals(5, routes.get(0).travelTime());

        assertEquals("Endor", routes.get(1).origin());
        assertEquals("Naboo", routes.get(1).destination());
        assertEquals(10, routes.get(1).travelTime());
    }
}