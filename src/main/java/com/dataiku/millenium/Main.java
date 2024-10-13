package com.dataiku.millenium;

import com.dataiku.millenium.model.EmpireContext;
import com.dataiku.millenium.core.Graph;
import com.dataiku.millenium.model.BountyHunter;

import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {

        // Initialize the graph with max fuel, departure, and arrival.
        Graph graph = new Graph(6, "Tatooine", "Endor");

        // Add edges based on the example universe.db data
        graph.addEdge("Tatooine", "Dagobah", 6);
        graph.addEdge("Dagobah", "Endor", 4);
        graph.addEdge("Dagobah", "Hoth", 1);
        graph.addEdge("Hoth", "Endor", 1);
        graph.addEdge("Tatooine", "Hoth", 6);

        // Set up bounty hunters with the given data
        Set<BountyHunter> bountyHunters = new HashSet<>();
        bountyHunters.add(new BountyHunter("Hoth", 6));
        bountyHunters.add(new BountyHunter("Hoth", 7));
        bountyHunters.add(new BountyHunter("Hoth", 8));

        // Initialize the EmpireContext with the countdown and the bounty hunters
        EmpireContext context = new EmpireContext(bountyHunters, 9);

        // Traverse the graph and print the result
        int minBounty = graph.traverse(context);
        System.out.println("Minimum bounty hunters encountered: " + minBounty);
    }
}


/*
 * Routes -> [String, String, time]
 * Autonomy -> Fuel
 * Start, Dest
 *
 * Countdown -> Integer
 * BountyHunter ->{ Planet (String), Day (Integer) }
 *
 *  Map<Name, Node>
 *  Node -> { Name, Fuel, Day, bounties_seen }
 *  Edge -> (u, v, w)  (u, f, d, b) -> (v, f - w, d + w, b)
 *  Edge -> (u, f, d, b) -> if (bounty(u, d)) (u, F, d + 1, b + 2), (u, f, d + 1, b + 1)
 *  else (u, F, d + 1, b)
 *
 *  Node -> { Name, Fuel, Bounty (bool) (Set later) }
 *  Edge -> (u, v, w)  (n, f, b) ->(w) (n', f - w, b')
 *  if (dist(Node(dest, X, b'')) <= countdown) take min(b'').
 */