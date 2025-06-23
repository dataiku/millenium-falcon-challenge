import { PlanetRoute } from '../PlanetRoute';

export type DistanceTo = { planet: string; travelDays: number };

/**
 * Routes graph represented as a planets adjacency map
 */
export class PlanetDistancesMap {
  private graph = new Map<string, DistanceTo[]>();
  private prepare = (planetName: string) => {
    if (this.graph.has(planetName)) {
      return;
    }
    this.graph.set(planetName, []);
  };

  get = (planetName: string) => {
    this.prepare(planetName);
    return this.graph.get(planetName) ?? [];
  };

  add = (planetName: string, distanceTo: DistanceTo) => {
    this.get(planetName).push(distanceTo);
    return this;
  };

  addRoute = ({ origin, destination, travel_time: time }: PlanetRoute) => {
    this.add(origin, { planet: destination, travelDays: time });
    this.add(destination, { planet: origin, travelDays: time });
    return this;
  };

  addAll = (routes: PlanetRoute[]) => {
    routes.forEach(this.addRoute);
    return this;
  };
}
