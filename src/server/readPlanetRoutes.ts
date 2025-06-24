import { PlanetRoute } from '@/domain/PlanetRoute';
import { DbClient } from './global.db';

export const readPlanetRoutes = async (
  db: DbClient,
): Promise<PlanetRoute[]> => {
  const routes = db.prepare('SELECT * FROM routes').all();
  if (routes.length === 0) {
    throw new Error('No routes');
  }
  // We trust our DB schema, so assuming items shape
  return routes as PlanetRoute[];
};
