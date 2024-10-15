package com.dataiku.millennium.core;

import com.dataiku.millennium.model.EmpireContext;
import com.dataiku.millennium.model.GraphProperties;
import com.dataiku.millennium.db.entity.Route;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Stream;

public class Graph {

    private final Map<String, List<Edge>> edgeMap;
    private final GraphProperties properties;

    public Graph(GraphProperties graphProperties) {
        this.edgeMap = new HashMap<>();
        this.properties = graphProperties;
    }

    public void initializeGraph(List<Route> routes) {
        for (Route route : routes) {
            String origin = route.origin(), destination = route.destination();
            int fuelCost = route.travelTime();
            edgeMap.computeIfAbsent(origin, k -> new ArrayList<>()).add(new Edge(origin, destination, fuelCost));
            edgeMap.computeIfAbsent(destination, k -> new ArrayList<>()).add(new Edge(destination, origin, fuelCost));
        }
    }

    // Traverse through the nodes and return the minimum number of hunters seen before countdown.
    public int traverse(final EmpireContext context) {
        if (properties.source().equals(properties.destination())) return 100;

        Set<Node> visitedNodes = new HashSet<>();
        Queue<Node> queue = new LinkedList<>();
        Node root = new Node(properties.source(), properties.maxFuel(), 0, 0);
        queue.add(root);
        visitedNodes.add(root);

        while (!queue.isEmpty()) {
            Node currentNode = queue.poll();
            System.out.println("[rathinb] Current node: " + currentNode);

            List<Edge> edges = edgeMap.getOrDefault(currentNode.name(), Collections.emptyList());
            edges.stream()
                    .flatMap(edge -> generatePossibleMoves(currentNode, edge, context))
                    .filter(visitedNodes::add)  // Both check and add in one operation
                    .forEach(queue::add);  // Directly add to the queue
        }

        // Find the minimum bounty for nodes matching the destination and within the countdown
        int hunters = visitedNodes.stream()
                .filter(node -> node.name().equals(properties.destination()))
                .filter(node -> node.day() <= context.countdown())
                .map(Node::bounty)
                .min(Integer::compareTo)
                .orElse(100);  // Return 100 as default if no valid path found

        return calculatePercentageProbability(hunters);
    }

    private Stream<Node> generatePossibleMoves(Node currentNode, Edge edge, EmpireContext context) {
        Node edgeMove = applyEdge(currentNode, edge, context);
        Node revisitMove = revisit(currentNode, context);
        return Stream.of(edgeMove, revisitMove).filter(Objects::nonNull);
    }

    Node applyEdge(Node currentNode, Edge edge, EmpireContext context) {
        int fuelLeft = currentNode.fuel() - edge.fuel();
        int timeToReach = currentNode.day() + edge.fuel();

        // Early exit if new fuel is less than 0 or if new day exceeds the countdown
        if (fuelLeft < 0 || timeToReach > context.countdown()) {
            return null;
        }

        int newBounty = context.hasHunter(edge.to(), timeToReach)
                ? currentNode.bounty() + 1
                : currentNode.bounty();

        return new Node(edge.to(), fuelLeft, timeToReach, newBounty);
    }

    private int calculatePercentageProbability(int bountyHunters) {
        double probability = 0;
        double multiplier = 1;
        for (int i = 0; i < bountyHunters; ++i) {
            multiplier /= 10;
            probability += multiplier;
            multiplier *= 9;
        }

        return (int) ((1 - probability) * 100);
    }

    Node revisit(Node node, EmpireContext context) {
        if (node.day() >= context.countdown()) return null;
        boolean hasHunter = context.hasHunter(node.name(), node.day() + 1);
        return new Node(node.name(), properties.maxFuel(), node.day() + 1, node.bounty() + (hasHunter ? 1 : 0));
    }

    record Edge(
            String from,
            String to,
            int fuel) {
    }

    record Node(
            String name,
            int fuel,
            int day,
            int bounty
    ) {
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Node node = (Node) o;
            return fuel == node.fuel &&
                    day == node.day &&
                    bounty == node.bounty &&
                    Objects.equals(name, node.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, fuel, day, bounty);
        }
    }

    // For testing purposes.
    Map<String, List<Edge>> edgeMap() {
        return edgeMap;
    }
}
