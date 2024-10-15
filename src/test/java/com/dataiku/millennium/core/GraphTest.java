package com.dataiku.millennium.core;

import com.dataiku.millennium.db.entity.Route;
import com.dataiku.millennium.model.EmpireContext;
import com.dataiku.millennium.model.GraphProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GraphTest {

    private GraphProperties mockGraphProperties;
    private EmpireContext mockEmpireContext;

    @BeforeEach
    void setUp() {
        mockGraphProperties = Mockito.mock(GraphProperties.class);
        mockEmpireContext = Mockito.mock(EmpireContext.class);
        Mockito.when(mockGraphProperties.destination()).thenReturn("Endor");
        Mockito.when(mockGraphProperties.source()).thenReturn("Tatooine");
        Mockito.when(mockGraphProperties.maxFuel()).thenReturn(10);
    }

    private Graph getTestGraph() {
        Graph graph = new Graph(mockGraphProperties);
        // Initialize graph.
        Route route1 = new Route("Tatooine", "Dagobah", 6);
        Route route2 = new Route("Dagobah", "Endor", 4);

        List<Route> routes = Arrays.asList(route1, route2);
        graph.initializeGraph(routes);
        return graph;
    }

    @Test
    void testInitializeGraph() {
        Graph graph = getTestGraph();
        assertEquals(3, graph.edgeMap().size());
    }

    @Test
    void testTraverse_NoHunters() {
        Mockito.when(mockEmpireContext.hasHunter(Mockito.anyString(), Mockito.anyInt())).thenReturn(false);
        Mockito.when(mockEmpireContext.countdown()).thenReturn(15);  // Set a countdown

        Graph graph = getTestGraph();
        int result = graph.traverse(mockEmpireContext);
        assertEquals(100, result);
    }

    @Test
    void testTraverse_WithHunters() {
        Mockito.when(mockEmpireContext.hasHunter("Endor", 10)).thenReturn(true);
        Mockito.when(mockEmpireContext.countdown()).thenReturn(10);

        Graph graph = getTestGraph();
        int result = graph.traverse(mockEmpireContext);
        assertEquals(90, result);
    }

    @Test
    void testTraverse_LowCountdown() {
        Mockito.when(mockEmpireContext.hasHunter("Endor", 10)).thenReturn(false);
        Mockito.when(mockEmpireContext.countdown()).thenReturn(1);

        Graph graph = getTestGraph();
        int result = graph.traverse(mockEmpireContext);
        assertEquals(0, result);
    }

    @Test
    void testTraverse_LowFuel() {
        Mockito.when(mockEmpireContext.hasHunter("Endor", 10)).thenReturn(false);
        Mockito.when(mockGraphProperties.maxFuel()).thenReturn(1);

        Graph graph = getTestGraph();
        int result = graph.traverse(mockEmpireContext);
        assertEquals(0, result);
    }

    @Test
    void testTraverse_SameSourceDestination() {
        Mockito.when(mockEmpireContext.hasHunter(Mockito.anyString(), Mockito.anyInt())).thenReturn(true);
        Mockito.when(mockGraphProperties.source()).thenReturn("Endor"); // Same as destination.

        Graph graph = getTestGraph();
        int result = graph.traverse(mockEmpireContext);
        assertEquals(100, result);
    }
}
