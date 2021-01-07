# Developer Technical Test @ Dataiku

## What are the odds?

[A long time ago in a galaxy far away...](https://youtu.be/2EGHIxz-bwI)

The Death Star - the Empire's ultimate weapon - is almost operational and is currently approaching the Endor planet. The countdown has started.

Han Solo, Chewbacca, Leia and C3PO are currently on Tatooine boarding on the Millenium Falcon. They must reach Endor to join the Rebel fleet and destroy the Death Star before it annihilates the planet.

The Empire has hired the best bounty hunters in the galaxy to capture the Millenium Falcon and stop it from joining the rebel fleet...

### Routes
The Millenium Falcon has an onboard map containing the list of all planets in the galaxy, and the number of days it takes to go from one to the other using an Hyperspace jump.

### Autonomy
However, the Millenium Falcon is not the newest ship of its kind and it has a limited autonomy. If it's lacking fuel to achieve his next Hyperspace jump, it first must stop for 1 day on the nearby planet to refuel.
For example, if its autonomy is 6 days, and it has already done a 4 days Hyperspace jump. It can reach another planet that is 1 or 2 days away from its current position. To reach planets that are 3 days or more away, it must refuel first.

### Bounty Hunters
The rebel command center has also intercepted a communication and the rebels know the various locations and days where Bounty Hunter have planned to hunt the Millenium Falcon.
If the Millenium Falcon arrives on a planet on a day where Bounty Hunter are expected to be on this planet, the crew has 10% chance of being captured. Likewise, if the Millenium Falcon refuels on a planet on a day where Bounty Hunter are expected to be on this planet, the crew has 10% chance of being captured.

Hint: To avoid the Bounty Hunters, the Millenium Falcon can land on a planet with no bounty hunters (even if its tank is full) and wait for 1 or more days before pursuing its route.

The mathematical formula to compute the total probability of being captured is:

![formula](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/formula-k.png)

where k is the number of times the Bounty Hunter tried to capture the Millenium Falcon.

For example, the probability to get captured is:
   - if the Millenium Falcon travels via 1 planet with bounty hunters:
  
   ![formula](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/formula-90.png)
   
   - if the Millenium Falcon travels via 1 planet with bounty hunters and refuels on this planet:

   ![formula](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/formula-2.png)

   - if the Millenium Falcon travels via 2 planets with bounty hunters:

   ![formula](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/formula-2.png)

   - if the Millenium Falcon travels via 3 planets with bounty hunters:

   ![formula](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/formula-3.png)


## The mission

Your mission is to create a web application to compute and display the odds that the Millenium Falcon reaches Endor in time and saves the galaxy.

![Never tell me the odds](https://github.com/dataiku/millenium-falcon-challenge/blob/master/resources/never-tell-me-the-odds.gif)

Your web application will be composed of a backend (the Millenium Falcon onboard computer), a front-end (C3PO) and a CLI (command-line interface aka R2D2).

### Back-end

When it starts, the back-end service will read a JSON configuration file containing the autonomy, the path towards an SQLite database file containing all the routes, the name of the planet where the Millenium Falcon is currently parked (Tatooine) and the name of the planet that the empire wants to destroy (Endor).

**millenium-falcon.json**
```json
{
  "autonomy": 6,
  "departure": "Tatooine",
  "arrival": "Endor",
  "routes_db": "universe.db"
}
```
   - autonomy (integer): autonomy of the Millenium Falcon in days.
   - departure (string): Planet where the Millenium Falcon is on day 0.
   - arrival (string): Planet where the Millenium Falcon must be at or before countdown.
   - routes_db (string): Path toward a SQLite database file containing the routes. The path can be either absolute or relative to the location of the `millenium-falcon.json` file itself.

The SQLite database will contain a table named ROUTES. Each row in the table represents a space route. Routes can be travelled **in any direction** (from origin to destination or vice-versa).

   - ORIGIN (TEXT): Name of the origin planet. Cannot be null or empty.
   - DESTINATION (TEXT): Name of the destination planet. Cannot be null or empty.
   - TRAVEL_TIME (INTEGER): Number days needed to travel from one planet to the other. Must be strictly positive.

| ORIGIN   | DESTINATION | TRAVEL_TIME |
|----------|-------------|-------------|
| Tatooine | Dagobah     | 4           |
| Dagobah  | Endor       | 1           |

### Front-end

The front-end should consists of a single-page application offering users a way to upload a JSON file containing the data intercepted by the rebels about the plans of the Empire and displaying the odds (as a percentage) that the Millenium Falcon reaches Endor in time and saves the galaxy.

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
- `0%` if the Millenium Falcon cannot reach Endor before the Death Star annihilates Endor
- `x% (0 < x < 100)` if the Millenium Falcon can reach Endor before the Death Star annihilates Endor but might be captured by bounty hunters.
- `100%` if the Millenium Falcon can reach Endor before the Death Star annihilates Endor without crossing a planet with bounty hunters on it.

### CLI

The command-line interface should consist of an executable that takes 2 files paths as input (respectively the paths toward the `millenium-falcon.json` and `empire.json` files) and prints the probability of success as a number ranging from 0 to 100.
```sh
$ give-me-the-odds example1/millenium-falcon.json example1/empire.json
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

**[millenium-falcon.json](examples/example1/millenium-falcon.json?raw=true)** (click to download)
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

The application should display 0% as The Millenium Falcon cannot go from Tatooine to Endor in 7 days or less (the Millenium Falcon must refuel for 1 day on either Dagobah or Hoth).

### Example 2
**[universe.db](examples/example2/universe.db?raw=true)** same as above

**[millenium-falcon.json](examples/example2/millenium-falcon.json?raw=true)**: same as above

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

The application should display 81% as The Millenium Falcon can go from Tatooine to Endor in 8 days with the following plan:
- Travel from Tatooine to Hoth, with 10% chance of being captured on day 6 on Hoth.
- Refuel on Hoth with 10% chance of being captured on day 7 on Hoth.
- Travel from Hoth to Endor

### Example 3
**[universe.db](examples/example3/universe.db?raw=true)** same as above

**[millenium-falcon.json](examples/example3/millenium-falcon.json?raw=true)**: same as above

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

The application should display 90% as The Millenium Falcon can go from Tatooine to Endor in 9 days with the following plan:
- Travel from Tatooine to Dagobath.
- Refuel on Dagobah
- Travel from Dagobah to Hoth, with 10% chance of being captured on day 8 on Hoth.
- Travel from Hoth to Endor

### Example 4
**[universe.db](examples/example4/universe.db?raw=true)** same as above

**[millenium-falcon.json](examples/example4/millenium-falcon.json?raw=true)**: same as above

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

The application should display 100% as The Millenium Falcon can go from Tatooine to Endor in 10 days and avoid Bounty Hunters with the following plans:
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
