package com.dataiku.millennium.cli.db;

import com.dataiku.millennium.db.entity.Route;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.anyString;

class RouteRepositoryTest {

    private RouteRepository routeRepository;
    private Connection mockConnection;
    private Statement mockStatement;
    private ResultSet mockResultSet;

    @BeforeEach
    void setUp() {
        mockConnection = Mockito.mock(Connection.class);
        mockStatement = Mockito.mock(Statement.class);
        mockResultSet = Mockito.mock(ResultSet.class);
        routeRepository = new RouteRepository(mockConnection);
    }

    @Test
    void testGetRoutesFromDB() throws Exception {
        // Mock the result of the database query
        Mockito.when(mockStatement.executeQuery(Mockito.anyString())).thenReturn(mockResultSet);
        Mockito.when(mockConnection.createStatement()).thenReturn(mockStatement);
        Mockito.when(mockResultSet.next()).thenReturn(true).thenReturn(false); // Only one result
        Mockito.when(mockResultSet.getString("origin")).thenReturn("Tatooine");
        Mockito.when(mockResultSet.getString("destination")).thenReturn("Hoth");
        Mockito.when(mockResultSet.getInt("travel_time")).thenReturn(5);

        List<Route> routes = routeRepository.getRoutesFromDB();

        assertEquals(1, routes.size());
        assertEquals("Tatooine", routes.get(0).origin());
        assertEquals("Hoth", routes.get(0).destination());
        assertEquals(5, routes.get(0).travelTime());

        Mockito.verify(mockStatement).executeQuery(anyString());
        Mockito.verify(mockResultSet).getString("origin");
        Mockito.verify(mockResultSet).getString("destination");
        Mockito.verify(mockResultSet).getInt("travel_time");
    }
}