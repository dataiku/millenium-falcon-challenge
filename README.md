# Developer Technical Test @ Dataiku


# Submission
## Tech Stack

The submission is split into three parts - backend, frontend and cli.
- Frontend - React.js
- CLI      - Java
- Backend  - Java + SpringBoot

## Running the application
### Running the CLI

We use `maven` to build and package our application. Just run the command to run the cli application.
```
$ mvn clean compile exec:java -Dexec.args="<millenium-falcon.json> <empire.json>"
```

For example
```
 $ mvn clean compile exec:java  -Dexec.args="examples/example3/millennium-falcon.json examples/example3/empire.json"
```

## Backend
The backend is made with SpringBoot. Run the following command to start the backend
```
$ mvn clean spring-boot:run
```

Now, this start listening at `localhost:8080`. We can send a POST via curl to verify the working
```
curl -X POST http://localhost:8080/millennium/traverse \
-H "Content-Type: application/json" \
-d @./examples/example1/empire.json
```

## Frontend
The frontend is written with React. Start the front-end with the following command

```angular2html
# Navigate to the front-end directory
$ cd millennium-frontend
$ npm start
```

Once the server is running, the front-end will be available in your browser at http://localhost:3000.

Now, you can upload your `empire.json` file and click `Submit`. If the backend is up and running,
you will get a response.

## Algorithm
We are given `N` planets, `M` routes between them, a maximum fuel autonomy `F`, a countdown `C`, and `B` bounty hunters
scattered across the planets.

### Idea
The problem can be modelled as a graph where planets are nodes, and the fuel cost (in days) is the weight of the edges
between planets. The goal is to reach the `destination` planet before the `countdown` expires. This can be modelled as
a shortest-path problem; if the distance between `source` and `destination` is less than countdown,
we can save the planet.

The shortest-problem can be solved with Dijkstra's algorithm which provides a time complexity of `O(M * log (N))`.

However, we must account for two additional constraints - `refueling` and `bountyHunters`.
Let’s tackle each constraint step-by-step.

### Adding the refueling constraint
To incorporate refueling, we adjust the graph to model to incorporate fuel levels. Now each node represents a state
`(planet, fuel)`. Travelling to another `planet_y` from `planet_x` with a fuel cost of `distance` is modelled as a
transition from `(planet_x, fuel)` to `(planet_y, fuel - distance)` with a weighted edge `distance`.

Refueling at a planet is straightforward. We can add a transition from `(planet, fuel)` to `(planet, max_fuel)`
with an edge of weight `1`, representing the time it takes to fuel.

Running Dijkstra's algorithm on the enhanced graph,  will now yield a set of potential destination states of the form
`(destination, fuel)`. The minimum distance among these states gives the optimal time to save the planet.

This algorithm will now take `O(M * F * log(N * F))` where `F` represents maximum fuel autonomy.

### Adding the bountyHunter constraint.
The next challenge involves accounting for bounty hunters. Bounty hunters may be stationed on certain planets on
specific days, and the goal is to avoid them whenever possible while still adhering to the countdown.

Refueling while waiting at a planet is always optimal, simplifying transitions in the graph. Now, we extend the graph
model to track time, introducing a new state `(planet, fuel, day)`.

- Travelling to a planet `other` at a distance `dist` is modelled as a transition to the state
  `(other, fuel - dist, day + dist)`.
- Refuelling/waiting on the same planet is a transition to the state `(planet, max_fuel, day + 1)`.

To incorporate bounty hunters, we define a flag `hasHunter`, which equals `1` if there is a hunter at the next state
and `0` otherwise. We update our model to `(planet, fuel, day, huntersSeen)` where `hunters_seen` tracks the number
of hunters seen so far.
- Travelling to another planet `(planet, fuel - dist, day + dist, huntersSeen + hasHunter)`.
- Refuelling/waiting on the same planet is a transition to the state
  `(planet, max_fuel, day + 1, huntersSeen + hasHunter)`.

In this model, the graph becomes unweighted. To solve, we check if any state `(destination, *, *, num_hunter)` is
reachable from the start. The minimum `num_hunters` encountered among all valid destination states gives the optimal
solution. This can be implemented via BFS + Dynamic programming to avoid visiting repeated states.
It has a time complexity of `O((M + N) * F * C * B)`.

### Further Optimization (Not implemented yet)
To simplify the state, we can eliminate the `hunters_seen` field and instead track the minimum number of hunters
encountered per state dynamically.

Since our graph is a Directed Acyclic Graph (DAG), we can process the states in order of days. For each state
`(planet, fuel, day)`, we maintain the minimum number of hunters encountered. When processing a transition from
state `X` to `Y`, we update `Y`’s hunter count to be the minimum of its current value and
`hunter_seen_at_X + has_hunter_at_Y`.

This is also a BFS approach combined with dynamic programming, and reduces the time complexity to `O((M + N) * F * C)`.

## What are the odds?

[A long time ago in a galaxy far away...](https://youtu.be/2EGHIxz-bwI)

The Death Star - the Empire's ultimate weapon - is almost operational and is currently approaching the Endor planet. The countdown has started.

Han Solo, Chewbacca, Leia and C3PO are currently on Tatooine boarding on the Millennium Falcon. They must reach Endor to join the Rebel fleet and destroy the Death Star before it annihilates the planet.

The Empire has hired the best bounty hunters in the galaxy to capture the Millennium Falcon and stop it from joining the rebel fleet...

### Routes
The Millennium Falcon has an onboard map containing the list of all planets in the galaxy, and the number of days it takes to go from one to the other using an Hyperspace jump.

### Autonomy
However, the Millennium Falcon is not the newest ship of its kind and it has a limited autonomy. If it's lacking fuel to achieve his next Hyperspace jump, it first must stop for 1 day on the nearby planet to refuel.
For example, if its autonomy is 6 days, and it has already done a 4 days Hyperspace jump. It can reach another planet that is 1 or 2 days away from its current position. To reach planets that are 3 days or more away, it must refuel first.

### Bounty Hunters
The rebel command center has also intercepted a communication and the rebels know the various locations and days where Bounty Hunter have planned to hunt the Millennium Falcon.
If the Millennium Falcon arrives on a planet on a day where Bounty Hunter are expected to be on this planet, the crew has 10% chance of being captured. Likewise, if the Millennium Falcon refuels on a planet on a day where Bounty Hunter are expected to be on this planet, the crew has 10% chance of being captured.

Hint: To avoid the Bounty Hunters, the Millennium Falcon can land on a planet with no bounty hunters (even if its tank is full) and wait for 1 or more days before pursuing its route.

The mathematical formula to compute the total probability of being captured is:

$$ {1 \over 10} + { 9 \over 10^2 } + { 9^2 \over 10^3 } + ... + { 9^{k-1} \over 10^{k} } $$


where k is the number of times the Bounty Hunter tried to capture the Millennium Falcon.

For example, the probability to get captured is:
   - if the Millennium Falcon travels via 1 planet with bounty hunters:
  
$$ {1 \over 10} = 0.1 $$
   
   - if the Millennium Falcon travels via 1 planet with bounty hunters and refuels on this planet:

$$ {1 \over 10} + { 9 \over 10^2 } = 0.19 $$

   - if the Millennium Falcon travels via 2 planets with bounty hunters:

$$ {1 \over 10} + { 9 \over 10^2 } = 0.19 $$

   - if the Millennium Falcon travels via 3 planets with bounty hunters:

$$ {1 \over 10} + { 9 \over 10^2 } + { 9^2 \over 10^3 } = 0.271 $$


## The mission

Your mission is to create a web application to compute and display the odds that the Millennium Falcon reaches Endor in time and saves the galaxy.

![Never tell me the odds](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/never-tell-me-the-odds.gif)

Your web application will be composed of a backend (the Millennium Falcon onboard computer), a front-end (C3PO) and a CLI (command-line interface aka R2D2).

### Back-end

When it starts, the back-end service will read a JSON configuration file containing the autonomy, the path towards an SQLite database file containing all the routes, the name of the planet where the Millennium Falcon is currently parked (Tatooine) and the name of the planet that the empire wants to destroy (Endor).

**millennium-falcon.json**
```json
{
  "autonomy": 6,
  "departure": "Tatooine",
  "arrival": "Endor",
  "routes_db": "universe.db"
}
```
   - autonomy (integer): autonomy of the Millennium Falcon in days.
   - departure (string): Planet where the Millennium Falcon is on day 0.
   - arrival (string): Planet where the Millennium Falcon must be at or before countdown.
   - routes_db (string): Path toward a SQLite database file containing the routes. The path can be either absolute or relative to the location of the `millennium-falcon.json` file itself.

The SQLite database will contain a table named ROUTES. Each row in the table represents a space route. Routes can be travelled **in any direction** (from origin to destination or vice-versa).

   - ORIGIN (TEXT): Name of the origin planet. Cannot be null or empty.
   - DESTINATION (TEXT): Name of the destination planet. Cannot be null or empty.
   - TRAVEL_TIME (INTEGER): Number days needed to travel from one planet to the other. Must be strictly positive.

| ORIGIN   | DESTINATION | TRAVEL_TIME |
|----------|-------------|-------------|
| Tatooine | Dagobah     | 4           |
| Dagobah  | Endor       | 1           |

### Front-end

The front-end should consists of a single-page application offering users a way to upload a JSON file containing the data intercepted by the rebels about the plans of the Empire and displaying the odds (as a percentage) that the Millennium Falcon reaches Endor in time and saves the galaxy.

**empire.json**
```json
{
  "countdown": 6, 
  "bounty_hunters": [
    {"planet": "Tatooine", "day": 4 },
    {"planet": "Dagobah", "day": 5 }
  ]
}
```

   - countdown (integer): number of days before the Death Star annihilates Endor
   - bounty_hunters (list): list of all locations where Bounty Hunter are scheduled to be present.
      - planet (string): Name of the planet. It cannot be null or empty.
      - day (integer): Day the bounty hunters are on the planet. 0 represents the first day of the mission, i.e. today.


The web page will display the probability of success as a number ranging from 0 to 100%:
- `0%` if the Millennium Falcon cannot reach Endor before the Death Star annihilates Endor
- `x% (0 < x < 100)` if the Millennium Falcon can reach Endor before the Death Star annihilates Endor but might be captured by bounty hunters.
- `100%` if the Millennium Falcon can reach Endor before the Death Star annihilates Endor without crossing a planet with bounty hunters on it.

### CLI

The command-line interface should consist of an executable that takes 2 files paths as input (respectively the paths toward the `millennium-falcon.json` and `empire.json` files) and prints the probability of success as a number ranging from 0 to 100.
```sh
$ give-me-the-odds example2/millennium-falcon.json example2/empire.json
81
```

## Examples

### Example 1
**[universe.db](examples/example1/universe.db?raw=true)** (click to download)
| ORIGIN   | DESTINATION | TRAVEL_TIME |
|----------|-------------|-------------|
| Tatooine | Dagobah     | 6           |
| Dagobah  | Endor       | 4           |
| Dagobah  | Hoth        | 1           |
| Hoth     | Endor       | 1           |
| Tatooine | Hoth        | 6           |

**[millennium-falcon.json](examples/example1/millennium-falcon.json?raw=true)** (click to download)
```
{
  "autonomy": 6,
  "departure": "Tatooine",
  "arrival": "Endor",
  "routes_db": "universe.db"
}
```
**[empire.json](examples/example1/empire.json?raw=true)** (click to download)
```
{
  "countdown": 7, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 }
  ]
}
```

The application should display 0% as The Millennium Falcon cannot go from Tatooine to Endor in 7 days or less (the Millennium Falcon must refuel for 1 day on either Dagobah or Hoth).

### Example 2
**[universe.db](examples/example2/universe.db?raw=true)** same as above

**[millennium-falcon.json](examples/example2/millennium-falcon.json?raw=true)**: same as above

**[empire.json](examples/example2/empire.json?raw=true)** (click to download)
```
{
  "countdown": 8, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 }
  ]
}
```

The application should display 81% as The Millennium Falcon can go from Tatooine to Endor in 8 days with the following plan:
- Travel from Tatooine to Hoth, with 10% chance of being captured on day 6 on Hoth.
- Refuel on Hoth with 10% chance of being captured on day 7 on Hoth.
- Travel from Hoth to Endor

### Example 3
**[universe.db](examples/example3/universe.db?raw=true)** same as above

**[millennium-falcon.json](examples/example3/millennium-falcon.json?raw=true)**: same as above

**[empire.json](examples/example3/empire.json?raw=true)**
```
{
  "countdown": 9, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 }
  ]
}
```

The application should display 90% as The Millennium Falcon can go from Tatooine to Endor in 9 days with the following plan:
- Travel from Tatooine to Dagobath.
- Refuel on Dagobah
- Travel from Dagobah to Hoth, with 10% chance of being captured on day 8 on Hoth.
- Travel from Hoth to Endor

### Example 4
**[universe.db](examples/example4/universe.db?raw=true)** same as above

**[millennium-falcon.json](examples/example4/millennium-falcon.json?raw=true)**: same as above

**[empire.json](examples/example4/empire.json?raw=true)**
```
{
  "countdown": 10, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 }
  ]
}
```

The application should display 100% as The Millennium Falcon can go from Tatooine to Endor in 10 days and avoid Bounty Hunters with the following plans:
- Travel from Tatooine to Dagobah,  refuel on Dagobah
- Wait for 1 day on Dagobah
- Travel from Dagobah to Hoth
- Travel from Hoth to Endor

or

- Wait for 1 day on Tatooine
- Travel from Tatooine to Dagobah, refuel on Dagobah
- Travel from Dagobah to Hoth
- Travel from Hoth to Endor


## Final note
There is absolutely no constraint on the technological stack that you might choose to achieve this,
either in the backend or frontend. Choose whichever you think is best suited for the task.

We are looking for high quality code: typically something that you would put into production and be proud of.

Have fun!