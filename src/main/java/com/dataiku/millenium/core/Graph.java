package com.dataiku.millenium.core;

import com.dataiku.millenium.model.EmpireContext;

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
    private final Integer maxFuel;
    private final String source;
    private final String destination;

    public Graph(int maxFuel, String source, String destination) {
        this.edgeMap = new HashMap<>();
        this.maxFuel = maxFuel;
        this.source = source;
        this.destination = destination;
    }

    public void addEdge(String from, String to, int fuelCost) {
        edgeMap.computeIfAbsent(from, k -> new ArrayList<>()).add(new Edge(from, to, fuelCost));
        edgeMap.computeIfAbsent(to, k -> new ArrayList<>()).add(new Edge(to, from, fuelCost));
    }

    // Traverse through the nodes and return the minimum number of hunters seen before countdown.
    public int traverse(final EmpireContext context) {
        if (source.equals(destination)) return 0;

        Set<Node> visitedNodes = new HashSet<>();
        Queue<Node> queue = new LinkedList<>();
        Node root = new Node(source, maxFuel, 0, 0);
        queue.add(root);
        visitedNodes.add(root);

        while (!queue.isEmpty()) {
            Node currentNode = queue.poll();

            List<Edge> edges = edgeMap.getOrDefault(currentNode.name(), Collections.emptyList());
            edges.stream()
                    .flatMap(edge -> generatePossibleMoves(currentNode, edge, context))
                    .filter(visitedNodes::add)  // Both check and add in one operation
                    .forEach(queue::add);  // Directly add to the queue
        }

        // Find the minimum bounty for nodes matching the destination and within the countdown
        return visitedNodes.stream()
                .filter(node -> node.name().equals(destination))
                .filter(node -> node.day() <= context.countdown())
                .map(Node::bounty)
                .min(Integer::compareTo)
                .orElse(100);  // Return 100 as default if no valid path found

    }

    private Stream<Node> generatePossibleMoves(Node currentNode, Edge edge, EmpireContext context) {
        Node edgeMove = applyEdge(currentNode, edge, context);
        Node revisitMove = revisit(currentNode, context);
        return Stream.of(edgeMove, revisitMove).filter(Objects::nonNull);
    }

    // TODO: Is EmpireContext a good name? Is this the right place?
    private Node applyEdge(Node currentNode, Edge edge, EmpireContext context) {
        int fuelLeft = currentNode.fuel() - edge.fuel();
        int timeToReach = currentNode.day() + edge.fuel();

        // Early exit if new fuel is less than 0 or if new day exceeds the countdown
        if (fuelLeft < 0 || timeToReach > context.countdown()) {
            return null;
        }

        // Use a concise ternary operation to adjust the bounty
        int newBounty = context.hasHunter(edge.to(), timeToReach)
                ? currentNode.bounty() + 1
                : currentNode.bounty();

        return new Node(edge.to(), fuelLeft, timeToReach, newBounty);
    }

    private Node revisit(Node node, EmpireContext context) {
        if (node.day() >= context.countdown()) return null;
        boolean hasHunter = context.hasHunter(node.name(), node.day() + 1);
        return new Node(node.name(), maxFuel, node.day() + 1, node.bounty() + (hasHunter ? 1 : 0));
    }

    private record Edge(
            String from,
            String to,
            int fuel) {}
}
