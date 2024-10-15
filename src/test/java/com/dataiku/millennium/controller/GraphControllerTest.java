package com.dataiku.millennium.controller;

import com.dataiku.millennium.core.GraphService;
import com.dataiku.millennium.model.EmpireContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GraphController.class)
class GraphControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GraphService graphService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testTraverseEndpoint() throws Exception {
        Integer mockAnswer = 80;
        Mockito.when(graphService.traverse(any(EmpireContext.class))).thenReturn(mockAnswer);
        EmpireContext empireContext = new EmpireContext(Collections.emptySet(), 10);

        // Perform a POST request and verify the response.
        mockMvc.perform(post("/millennium/traverse")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(empireContext)))
                .andExpect(status().isOk())
                .andExpect(content().string(mockAnswer.toString()));
    }
}
