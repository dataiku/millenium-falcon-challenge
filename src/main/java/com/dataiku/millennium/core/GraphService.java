package com.dataiku.millennium.core;

import com.dataiku.millennium.db.repository.RouteRepository;
import com.dataiku.millennium.model.config.MillenniumConfig;
import com.dataiku.millennium.model.EmpireContext;
import com.dataiku.millennium.db.entity.Route;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.StreamSupport;

public class GraphService {
    private static final Logger LOG = Logger.getLogger(GraphService.class.getName());

    private final Graph graph;
    private final MillenniumConfig config;
    private final RouteRepository routeRepository;

    public GraphService(MillenniumConfig millenniumConfig, RouteRepository routeRepository) {
        this.config = millenniumConfig;
        this.routeRepository = routeRepository;
        this.graph = new Graph(this.config.getGraphProperties());
    }

    public int traverse(EmpireContext context) {
        return graph.traverse(context);
    }

    // Spring automagically calls this method right after the beans are initialized.
    @PostConstruct
    private void initializeGraph() {
        graph.initializeGraph(getRoutes());
    }

    private List<Route> getRoutes() {
        return StreamSupport.stream(routeRepository.findAll().spliterator(), false)
                .toList();
    }
}
