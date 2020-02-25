# Developer Technical Test @ Dataiku

## What are the odds?

[A long time ago in a galaxy far away...](https://starwarsintrocreator.kassellabs.io/?ref=redirect#!/BLOF1WUcqAU6USUYMZ_W)

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

![formula](https://github.com/dataiku/millenium-falcon-challenge-simple/blob/master/resources/formula-k.png)

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

Your mission is to program C3PO to compute the odds that the Millenium Falcon reaches Endor in time and saves the galaxy.

![Never tell me the odds](https://dev.dataiku.com/dataiku-dev-challenge/images/image6.gif)

Your program will be given 2 JSON files as input:

**millenium-falcon.json**

The first JSON file contains the navigation data of the Millenium Falcon
```json
{
  "autonomy": 6, 
  "routes": [
    {"origin": "Tatooine", "destination": "Dagobah", "travelTime": 4 },
    {"origin": "Dagobah", "destination": "Endor", "travelTime": 1 },
  ]
}
```
   - autonomy (integer): autonomy of the Millenium Falcon in days.
   - routes (list): List of all space routes in the galaxy. Each item in the list represents a route. Routes can be travelled in any direction (from origin to destination or vice-versa)
      - Origin (string): Name of the origin planet. Cannot be null or empty.
      - Destination (string):  Name of the destination planet. Cannot be null or empty.
      - travelTime (integer): Number days needed to travel from one planet to the other. Must be strictly positive..

**empire.json**

The second JSON file contains the data intercepted by the rebels about the plans of the Empire:
```json
{
  "countdown": 6, 
  "bounty_hunters": [
    {"planet": "Tatooine", "day": 4 },
    {"planet": "Dagobah", "day": 5 },
  ]
}
```

   - countdown (integer): number of days before the Death Star annihilates Endor
   - bounty_hunters (list): list of all locations where Bounty Hunter are scheduled to be present.
      - planet (string): Name of the planet. It cannot be null or empty.
      - day (integer): Day the bounty hunters are on the planet. 0 represents the first day of the mission, i.e. today.


Your program should return the probability of success as a floating-point number ranging from 0 to 1:
- `0` if the Millenium Falcon cannot reach Endor before the Death Star annihilates Endor
- `x (0 < x < 1)` if the Millenium Falcon can reach Endor before the Death Star annihilates Endor but might be captured by bounty hunters.
- `1` if the Millenium Falcon can reach Endor before the Death Star annihilates Endor without crossing a planet with bounty hunters on it.

Your task is to create a class and a method with the following signature (depending on your preferred  language) :

**Java**
```java
public class C3PO {
    public C3PO(File milleniumFalconJsonFile) {
        ...
    }
    public double giveMeTheOdds(File empireJsonFile) {
        ...
    }
} 
```

**Python**
```python
class C3PO:
    def __init__(self, milleniumFalconJsonFile):
        ...
    def giveMeTheOdds(self, empireJsonFile):
        ...
```

## Examples

### Example 1
**[universe-example1.db](examples/example1/universe-example1.db)**
| ORIGIN   | DESTINATION | TRAVEL_TIME |
|----------|-------------|-------------|
| Tatooine | Dagobah     | 6           |
| Dagobah  | Endor       | 4           |
| Dagobah  | Hoth        | 1           |
| Hoth     | Endor       | 1           |
| Tatooine | Hoth        | 6           |

**[millenium-falcon.json](examples/example1/millenium-falcon.json)**
```
{
  "autonomy": 6,
  "departure": "Tatooine",
  "arrival": "Endor",
  "routes_db": "universe-example1.db"
}
```
**[empire.json](examples/example1/empire.json)**
```
{
  "countdown": 7, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 },
  ]
}
```

`giveMeTheOdds(milleniumFalconJsonFile, empireJsonFile)` should return 0 as The Millenium Falcon cannot go from Tatooine to Endor in 7 days or less (the Millenium Falcon must refuel for 1 day on either Dagobah or Hoth).

### Example 2
**[millenium-falcon.json](examples/example2/millenium-falcon.json)**: same as above

**[empire.json](examples/example2/empire.json)**
```
{
  "countdown": 8, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 },
  ]
}
```

`giveMeTheOdds(milleniumFalconJsonFile, empireJsonFile)` should return 0.81 as The Millenium Falcon can go from Tatooine to Endor in 8 days with the following plan:
- Travel from Tatooine to Hoth, with 10% chance of being captured on day 6 on Hoth.
- Refuel on Hoth with 10% chance of being captured on day 7 on Hoth.
- Travel from Hoth to Endor

### Example 3
**[millenium-falcon.json](examples/example3/millenium-falcon.json)**: same as above

**[empire.json](examples/example3/empire.json)**
```
{
  "countdown": 9, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 },
  ]
}
```

`giveMeTheOdds(milleniumFalconJsonFile, empireJsonFile)` should return 0.9 as The Millenium Falcon can go from Tatooine to Endor in 8 days with the following plan:
- Travel from Tatooine to Dagobath.
- Refuel on Dagobah
- Travel from Dagobah to Hoth, with 10% chance of being captured on day 8 on Hoth.
- Travel from Hoth to Endor

### Example 4
**[millenium-falcon.json](examples/example4/millenium-falcon.json)**: same as above

**[empire.json](examples/example4/empire.json)**
```
{
  "countdown": 10, 
  "bounty_hunters": [
    {"planet": "Hoth", "day": 6 }, 
    {"planet": "Hoth", "day": 7 },
    {"planet": "Hoth", "day": 8 },
  ]
}
```

`giveMeTheOdds(milleniumFalconJsonFile, empireJsonFile)` should return 1 as The Millenium Falcon can go from Tatooine to Endor in 10 days and avoid Bounty Hunters with the following plans:
- Travel from Tatooine to Dagobah,  refuel on Dagobah
- Wait for 1 day on Dagobah
- Travel from Dagobah to Hoth
- Travel from Hoth to Endor

or

- Wait for 1 day on Tatooine
- Travel from Tatooine to Dagobah, refuel on Dagobah
- Travel from Dagobah to Hoth
- Travel from Hoth to Endor
