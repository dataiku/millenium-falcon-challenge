import { isEmpireIntel } from './lib/EmpireIntel';
import { getBaseURL } from './lib/getBaseURL';
import { loadJSON } from './lib/loadJSON';
import { readMfConfig } from './lib/MfConfig';
import { findPath } from './lib/pathFinder/findPath';
import { readPlanetRoutes } from './lib/PlanetRoute';

const readEmpireIntel = async (empireIntelJSONPath: string) => {
  const empireIntel = await loadJSON(empireIntelJSONPath);
  if (!isEmpireIntel(empireIntel)) {
    throw new Error('Invalid empire intel');
  }
  return empireIntel;
};

export const main = async ({
  mfCfgRelativePath,
  empireCfgRelativePath,
}: {
  mfCfgRelativePath: string;
  empireCfgRelativePath: string;
}) => {
  const { milleniumFalcon, dbAbsPath, mfConfigAbsPath } =
    await readMfConfig(mfCfgRelativePath);
  const routes = await readPlanetRoutes(dbAbsPath);
  const intelPath = getBaseURL(empireCfgRelativePath);
  const empireIntel = await readEmpireIntel(intelPath);

  return {
    paths: {
      db: dbAbsPath,
      mfConfigAbsPath: mfConfigAbsPath,
      intel: intelPath,
    },
    routes,
    mfConfig: milleniumFalcon,
    empireIntel,
    odds: findPath(routes, milleniumFalcon, empireIntel),
  };
};
