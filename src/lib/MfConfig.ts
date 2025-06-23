import { ok } from 'node:assert';
import { resolve } from 'node:path';
import { getBaseURL } from './getBaseURL';
import { loadJSON } from './loadJSON';
import { isRecord } from './isRecord';

/**
 * Millenium Falcon config
 */
export type MfConfig = {
  autonomy: number;
  departure: string;
  arrival: string;
  routes_db: string;
};

export const isMfConfig = (cfg: unknown): cfg is MfConfig =>
  isRecord(cfg) &&
  typeof cfg.autonomy === 'number' &&
  typeof cfg.departure === 'string' &&
  typeof cfg.arrival === 'string' &&
  typeof cfg.routes_db === 'string';

export const readMfConfig = async (cfgRelPath: string) => {
  const mfConfigAbsPath = getBaseURL(cfgRelPath);
  const mfCfg = await loadJSON(mfConfigAbsPath);
  ok(isMfConfig(mfCfg), 'Invalid millenium-falcon.json');

  const dbAbsPath = resolve(mfConfigAbsPath, '..', mfCfg.routes_db);
  return {
    milleniumFalcon: mfCfg,
    dbAbsPath,
    mfConfigAbsPath,
  };
};
