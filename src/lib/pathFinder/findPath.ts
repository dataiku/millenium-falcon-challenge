import { EmpireIntel } from '@/domain/EmpireIntel';
import { MfConfig, SpaceshipParams } from '@/domain/MfConfig';
import { PlanetRoute } from '@/domain/PlanetRoute';
import { BountyHunterSet } from './BountyHunterMap';
import { calculateSuccessProbability } from './calculateCaptureProbability';
import { MinPriorityQueue } from './MinPriorityQueue';
import { PlanetDistancesMap } from './PlanetDistancesMap';
import {
  compareTravelStates,
  createTravelState,
  TravelState,
  TravelStateItem,
  TravelStateMap,
} from './TravelState';
import { reconstructPath } from './reconstructPath';

const MEET_BH_CHANCE = 0.1;

/**
 * Implements a modified Dijkstra's algorithm to find the path
 * with the minimum bounty hunter encounters within the given countdown time,
 * considering fuel autonomy and refueling mechanics.
 *
 * @returns The probability of success from 0 to 1. 0 if Endor cannot be reached in time.
 */
export function findPath(
  routes: PlanetRoute[],
  { autonomy, departure, arrival }: SpaceshipParams,
  { countdown, bounty_hunters: bountyHunters }: EmpireIntel,
): { odds: number; path: TravelState[] } {
  if (autonomy < 0 || countdown < 0) {
    return { odds: 0, path: [] };
  }

  const bountyHuntersSet = new BountyHunterSet().addAll(bountyHunters);
  const bhAtDeparture = bountyHuntersSet.has(departure, 0) ? 1 : 0;
  if (departure === arrival) {
    return {
      odds: calculateSuccessProbability(bhAtDeparture, MEET_BH_CHANCE),
      path: [],
    };
  }

  const minEncountersToState: TravelStateMap = new Map();
  const universe = new PlanetDistancesMap().addAll(routes);
  const mpq = new MinPriorityQueue(compareTravelStates);
  //
  const startTS = createTravelState(bhAtDeparture, null, {
    day: 0,
    planet: departure,
    fuel: autonomy,
    bountyHunter: bhAtDeparture === 1,
  });
  mpq.push(startTS);

  // Variables to track the overall best path found to the arrival planet (Optimization)
  let minOverallEncounters: number = Infinity;
  let minPathTimeForMinEncounters: number = Infinity;
  let bestPathFinalStateKey: string | null = startTS.key;

  const saveIfGood = (
    encounters: number,
    curTS: TravelState,
    travelPoint: Omit<TravelStateItem, 'bountyHunter'>,
  ) => {
    if (travelPoint.day > countdown) {
      return;
    }
    if (bountyHuntersSet.has(travelPoint.planet, travelPoint.day)) {
      encounters += 1;
    }
    const ts = createTravelState(encounters, curTS.key, {
      ...travelPoint,
      bountyHunter: bountyHuntersSet.has(travelPoint.planet, travelPoint.day),
    });
    const similar = minEncountersToState.get(ts.key);
    // Only save if the new state is better than the existing one
    if (!similar || ts.encounters < similar.encounters) {
      mpq.push(ts);
    }
  };

  //
  // --- Dijkstra's Algorithm Implementation ---
  //
  while (!mpq.isEmpty()) {
    const currentTravelState = mpq.pop()!;
    const { encounters, item: current } = currentTravelState;

    // Too slow. WASTED
    if (current.day > countdown) {
      continue;
    }
    // Skip if current path already has more encounters than our best known path to arrival
    if (encounters > minOverallEncounters) {
      continue;
    }
    // Skip if it's longer than already found shorter path
    if (
      encounters === minOverallEncounters &&
      current.day > minPathTimeForMinEncounters
    ) {
      continue;
    }
    // If we've already found a path to this exact state with fewer or equal encounters, skip
    const enc = minEncountersToState.get(currentTravelState.key)?.encounters;
    if (enc !== undefined && enc <= encounters) {
      continue;
    }
    minEncountersToState.set(currentTravelState.key, currentTravelState);

    //
    // --- Goal Check ---
    //
    if (current.planet === arrival) {
      // If this path has fewer encounters, it's the new best
      if (encounters < minOverallEncounters) {
        bestPathFinalStateKey = currentTravelState.key;
        minOverallEncounters = encounters;
      }

      // If encounters are the same, but this path is faster, it's also better
      if (
        encounters === minOverallEncounters &&
        current.day < minPathTimeForMinEncounters
      ) {
        bestPathFinalStateKey = currentTravelState.key;
        minPathTimeForMinEncounters = current.day;
      }
      // Arrived
      continue;
    }
    //
    // --- Explore possible actions from the current state ---
    //
    // 1. Travel to Neighbors
    // Iterate through all possible hyperspace jumps from the current planet
    for (const { planet, travelDays } of universe.get(current.planet)) {
      // Option A: Direct jump (if enough fuel for the jump)
      if (current.fuel >= travelDays) {
        saveIfGood(encounters, currentTravelState, {
          day: current.day + travelDays,
          planet,
          fuel: current.fuel - travelDays,
        });
      }

      // Option B: Refuel then jump (if a jump is not possible directly, or chosen as a strategy)
      // This covers cases where fuel is insufficient OR where refueling is done strategically to avoid bounty hunters
      // Refueling takes 1 day and fills the tank back to maximum capacity
      const refuelDay = current.day + 1;
      const refuelEncounters = bountyHuntersSet.has(current.planet, refuelDay)
        ? encounters + 1
        : encounters;

      // Only proceed if the jump is possible after refueling
      if (autonomy > travelDays) {
        saveIfGood(refuelEncounters, currentTravelState, {
          day: refuelDay + travelDays,
          planet,
          fuel: autonomy - travelDays,
        });
      }
    }

    // 2. Refuel Action - This is distinct from refueling *to* jump.
    // It's explicitly choosing to spend a day refueling to top off the tank,
    // even if not immediately needed for a jump
    // Only makes sense if the tank isn't already full
    if (current.fuel < autonomy) {
      saveIfGood(encounters, currentTravelState, {
        day: current.day + 1,
        planet: current.planet,
        fuel: autonomy, // Tank is filled to maximum capacity
      });
    }

    // 3. Wait Action - Spend 1 day without traveling or refueling
    // This is important to avoid bounty hunters or simply to delay for strategic reasons.
    // Check for bounty hunters while waiting at the current planet
    saveIfGood(encounters, currentTravelState, {
      day: current.day + 1,
      planet: current.planet,
      fuel: current.fuel, // Fuel remains unchanged during waiting
    });
  }

  // If minOverallEncounters is still Infinity,
  // then no valid path was found within the countdown time
  if (minOverallEncounters === Infinity) {
    return { odds: 0, path: [] };
  }
  return {
    odds: calculateSuccessProbability(minOverallEncounters, MEET_BH_CHANCE),
    path: reconstructPath(bestPathFinalStateKey, minEncountersToState),
  };
}
