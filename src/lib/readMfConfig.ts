import { ok } from 'node:assert';
import { resolve } from 'node:path';
import { getBaseURL } from './getBaseURL';
import { loadJSON } from './loadJSON';

type MfCfg = {
  autonomy: number;
  departure: string;
  arrival: string;
  routes_db: string;
};

export const isMfConfig = (cfg: unknown): cfg is MfCfg =>
  typeof cfg === 'object' &&
  cfg !== null &&
  'autonomy' in cfg &&
  typeof cfg.autonomy === 'number' &&
  'departure' in cfg &&
  typeof cfg.departure === 'string' &&
  'arrival' in cfg &&
  typeof cfg.arrival === 'string' &&
  'routes_db' in cfg &&
  typeof cfg.routes_db === 'string';

export const readMfConfig = async (mfRelPath: string) => {
  const mfPath = getBaseURL(mfRelPath);
  const mfCfg = await loadJSON(mfPath);
  const dbAbsPath = resolve(mfPath, '..', mfCfg.routes_db);
  ok(isMfConfig(mfCfg), 'Invalid millenium-falcon.json');
  return {
    milleniumFalcon: mfCfg,
    dbAbsPath,
  };
};
