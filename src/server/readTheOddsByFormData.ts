'use server';
import { EmpireIntel } from '@/domain/EmpireIntel';
import { readPlanetRoutes } from './readPlanetRoutes';
import { db } from './global.db';
import { PlanetRoute } from '@/domain/PlanetRoute';
import { parseIntel } from './parseIntel';
import { createSubmitHandler } from './createSubmitHandler';
import { appConfig } from './global.appConfig';
import { findPath } from '@/lib/pathFinder/findPath';

export type OkData = {
  intel: EmpireIntel;
  odds: number;
};

export const readTheOddsByFormData = async (
  formData: FormData,
): Promise<OkData> => {
  const [routes, intel] = await Promise.all([
    readPlanetRoutes(db()),
    parseIntel(formData.get('intel')),
  ]);
  const odds = await findPath(routes, appConfig().milleniumFalcon, intel);
  return {
    intel,
    odds,
  };
};

export const handleSubmit = createSubmitHandler(readTheOddsByFormData);
