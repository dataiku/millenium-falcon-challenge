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

export const readMfConfig = async (mfRelPath: string) => {
  const mfPath = getBaseURL(mfRelPath);
  const mfCfg = await loadJSON(mfPath);
  ok(isMfConfig(mfCfg), 'Invalid millenium-falcon.json');

  const dbAbsPath = resolve(mfPath, '..', mfCfg.routes_db);
  return {
    milleniumFalcon: mfCfg,
    dbAbsPath,
  };
};
