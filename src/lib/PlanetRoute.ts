import * as sqlite from 'node:sqlite';
import { isRecord } from './isRecord';

export type PlanetRoute = {
  origin: string;
  destination: string;
  travel_time: number;
};

export const isPlanetRoute = (it: unknown): it is PlanetRoute =>
  isRecord(it) &&
  typeof it.origin === 'string' &&
  typeof it.destination === 'string' &&
  typeof it.travel_time === 'number';

export const readPlanetRoutes = async (
  dbPath: string,
): Promise<PlanetRoute[]> => {
  const db = new sqlite.DatabaseSync(dbPath);
  const routes = db.prepare('SELECT * FROM routes').all();
  if (routes.length === 0) {
    throw new Error('No routes');
  }
  // We trust our DB schema, so assuming items shape
  return routes as PlanetRoute[];
};
