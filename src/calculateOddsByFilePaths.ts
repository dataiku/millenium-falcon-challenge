import { cwd } from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import { isEmpireIntel } from './domain/EmpireIntel';
import { getBaseURL } from './lib/getBaseURL';
import { loadJSON } from './lib/loadJSON';
import { readAppConfig } from './server/readAppConfig';
import { readPlanetRoutes } from './server/readPlanetRoutes';
import { findPath } from './lib/pathFinder/findPath';

const readEmpireIntel = async (empireIntelJSONPath: string) => {
  const empireIntel = await loadJSON(empireIntelJSONPath);
  if (!isEmpireIntel(empireIntel)) {
    throw new Error('Invalid empire intel');
  }
  return empireIntel;
};

const readRoutesAndCfg = async (cfgPath: string) => {
  const { paths, milleniumFalcon } = await readAppConfig(cfgPath);
  const db = new DatabaseSync(paths.db);
  const routes = await readPlanetRoutes(db);
  return { milleniumFalcon, routes, paths };
};

export const calculateOddsByFilePaths = async ({
  mfCfgRelativePath,
  empireCfgRelativePath,
}: {
  mfCfgRelativePath: string;
  empireCfgRelativePath: string;
}) => {
  const [{ milleniumFalcon, routes, paths }, empireIntel] = await Promise.all([
    readRoutesAndCfg(mfCfgRelativePath),
    readEmpireIntel(getBaseURL(empireCfgRelativePath)),
  ]);
  const odds = await findPath(routes, milleniumFalcon, empireIntel);

  return {
    paths: {
      cwd: cwd(),
      mfConfig: paths.configRel,
      db: paths.dbRel,
      intel: empireCfgRelativePath,
    },
    routes,
    mfConfig: milleniumFalcon,
    empireIntel,
    odds,
  };
};
