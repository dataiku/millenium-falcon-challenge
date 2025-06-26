export type TravelStateItem = {
  day: number;
  planet: string;
  fuel: number;
};

export type TravelState = {
  encounters: number;
  item: TravelStateItem;
  key: string;
  prevKey: string | null;
};

/**
 * Map to store the minimum encounters to reach a specific state:
 * "day-planet-fuel" -> min encounters
 */
export type TravelStateMap = Map<string, TravelState>;

/**
 * First goes with less encounters, then days of travel
 */
export const compareTravelStates = (a: TravelState, b: TravelState) => {
  if (a.encounters !== b.encounters) {
    return a.encounters - b.encounters;
  }
  if (a.item.day !== b.item.day) {
    return a.item.day - b.item.day;
  }
  return 0;
};

export const createTravelState = (
  encounters: number,
  prevKey: string | null,
  item: {
    day: number;
    planet: string;
    fuel: number;
    bountyHunter: boolean;
  },
): TravelState => ({
  encounters,
  item,
  prevKey,
  key: `${item.day}-${item.planet}-${item.fuel}`,
});
