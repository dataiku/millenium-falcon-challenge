'use server';
import { EmpireIntel } from '@/domain/EmpireIntel';
import { readPlanetRoutes } from './readPlanetRoutes';
import { db } from './global.db';
import { parseIntel } from './parseIntel';
import { createSubmitHandler } from './createSubmitHandler';
import { appConfig } from './global.appConfig';
import { findPath } from '@/lib/pathFinder/findPath';
import { TravelState } from '@/lib/pathFinder/TravelState';

export type OkData = {
  intel: EmpireIntel;
  odds: number;
  path: TravelState[];
};

export const readTheOddsByFormData = async (
  formData: FormData,
): Promise<OkData> => {
  const [routes, intel] = await Promise.all([
    readPlanetRoutes(db()),
    parseIntel(formData.get('intel')),
  ]);
  const { odds, path } = await findPath(
    routes,
    appConfig().milleniumFalcon,
    intel,
  );
  return {
    intel,
    odds,
    path,
  };
};

export const handleSubmit = createSubmitHandler(readTheOddsByFormData);
