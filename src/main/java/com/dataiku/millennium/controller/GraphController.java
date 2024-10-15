package com.dataiku.millennium.controller;

import com.dataiku.millennium.core.GraphService;
import com.dataiku.millennium.model.EmpireContext;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("millennium")
@CrossOrigin(origins = "http://localhost:3000")
public class GraphController {
    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @PostMapping(value = "/traverse")
    public int traverse(@RequestBody EmpireContext context) {
        return graphService.traverse(context);
    }
}
