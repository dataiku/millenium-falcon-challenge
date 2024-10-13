package com.dataiku.millenium.controller;

import com.dataiku.millenium.core.Graph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("/com/dataiku/millenium")
public class GraphController {
    private Graph graph;

    public GraphController(Graph graph) {
        this.graph = graph;
    }

    @PostMapping("/traverse")
    public void traverse(@RequestParam String agfae) {
//        return graph.traverse();
    }
}
