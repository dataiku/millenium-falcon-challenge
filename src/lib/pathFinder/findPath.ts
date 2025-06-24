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
} from './TravelState';

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
): number {
  if (autonomy <= 0 || countdown <= 0) {
    return 0;
  }

  const universe = new PlanetDistancesMap().addAll(routes);
  const bountyHuntersSet = new BountyHunterSet().addAll(bountyHunters);
  const mpq = new MinPriorityQueue<TravelState>(compareTravelStates).push(
    createTravelState(0, { day: 0, planet: departure, fuel: autonomy }),
  );
  // Map to store the minimum encounters to reach a specific state: "planet,day,fuel" -> min encounters
  const minEncountersToState = new Map<string, number>();
  // Variables to track the overall best path found to the arrival planet (Optimization)
  let minOverallEncounters: number = Infinity;
  let minPathTimeForMinEncounters: number = Infinity;

  const saveIfGood = (encounters: number, ts: TravelStateItem) => {
    if (ts.day > countdown) {
      return;
    }
    if (bountyHuntersSet.has(ts.planet, ts.day)) {
      encounters += 1;
    }
    const tsi = createTravelState(encounters, ts);
    const minEnc = minEncountersToState.get(tsi.key);
    if (minEnc === undefined || encounters < minEnc) {
      mpq.push(tsi);
    }
  };
  //
  // --- Dijkstra's Algorithm Implementation ---
  //
  while (!mpq.isEmpty()) {
    const ts = mpq.pop()!;
    const {
      encounters,
      item: { day: currentDay, planet: currentPlanet, fuel: currentFuel },
    } = ts;

    // Too slow. WASTED
    if (currentDay > countdown) {
      continue;
    }
    // Skip if current path already has more encounters than our best known path to arrival
    if (encounters > minOverallEncounters) {
      continue;
    }
    // Skip if it's longer than already found shorter path
    if (
      encounters === minOverallEncounters &&
      currentDay > minPathTimeForMinEncounters
    ) {
      continue;
    }
    // If we've already found a path to this exact state with fewer or equal encounters, skip
    const enc = minEncountersToState.get(ts.key);
    if (enc !== undefined && enc >= encounters) {
      continue;
    }

    minEncountersToState.set(ts.key, encounters);
    //
    // --- Goal Check ---
    //
    if (currentPlanet === arrival) {
      // If this path has fewer encounters, it's the new best
      minOverallEncounters = Math.min(minOverallEncounters, encounters);
      // If encounters are the same, but this path is faster, it's also better
      if (encounters === minOverallEncounters) {
        minPathTimeForMinEncounters = Math.min(
          minPathTimeForMinEncounters,
          currentDay,
        );
      }
      // Arrived
      continue;
    }
    //
    // --- Explore possible actions from the current state ---
    //
    // 1. Travel to Neighbors
    // Iterate through all possible hyperspace jumps from the current planet
    for (const { planet, travelDays } of universe.get(currentPlanet)) {
      // Option A: Direct jump (if enough fuel for the jump)
      if (currentFuel >= travelDays) {
        saveIfGood(encounters, {
          day: currentDay + travelDays,
          planet,
          fuel: currentFuel - travelDays,
        });
      }

      // Option B: Refuel then jump (if a jump is not possible directly, or chosen as a strategy)
      // This covers cases where fuel is insufficient OR where refueling is done strategically to avoid bounty hunters
      // Refueling takes 1 day and fills the tank back to maximum capacity
      const refuelDay = currentDay + 1;
      const refuelEncounters = bountyHuntersSet.has(currentPlanet, refuelDay)
        ? encounters + 1
        : encounters;

      // Only proceed if the jump is possible after refueling
      if (autonomy > travelDays) {
        saveIfGood(refuelEncounters, {
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
    if (currentFuel < autonomy) {
      saveIfGood(encounters, {
        day: currentDay + 1,
        planet: currentPlanet,
        fuel: autonomy, // Tank is filled to maximum capacity
      });
    }

    // 3. Wait Action - Spend 1 day without traveling or refueling
    // This is important to avoid bounty hunters or simply to delay for strategic reasons.
    // Check for bounty hunters while waiting at the current planet
    saveIfGood(encounters, {
      day: currentDay + 1,
      planet: currentPlanet,
      fuel: currentFuel, // Fuel remains unchanged during waiting
    });
  }

  // If minOverallEncounters is still Infinity,
  // then no valid path was found within the countdown time
  return minOverallEncounters === Infinity
    ? 0
    : calculateSuccessProbability(minOverallEncounters);
}
