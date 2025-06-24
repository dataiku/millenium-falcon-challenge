export type TravelStateItem = {
  day: number;
  planet: string;
  fuel: number;
};

export type TravelState = {
  encounters: number;
  item: TravelStateItem;
  key: string;
};

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
  item: { day: number; planet: string; fuel: number },
): TravelState => ({
  encounters,
  item,
  key: `${item.day}-${item.planet}-${item.fuel}`,
});

export class TravelStateMap {
  private map = new Map<string, number>();
  add = (ts: TravelState) => {
    this.map.set(ts.key, ts.encounters);
    return this;
  };
  update = (ts: TravelState) => {
    const enc = this.map.get(ts.key);
    if (enc === undefined || ts.encounters < enc) {
      this.map.set(ts.key, ts.encounters);
    }
    return this;
  };
}
