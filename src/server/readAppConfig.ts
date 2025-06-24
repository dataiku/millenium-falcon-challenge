import { ok } from 'node:assert';
import { resolve } from 'node:path';
import { isMfConfig } from '@/domain/MfConfig';
import { getBaseURL } from '@/lib/getBaseURL';
import { loadJSON } from '@/lib/loadJSON';

export const readAppConfig = async (configRelPath: string) => {
  const configAbsPath = getBaseURL(configRelPath);
  const cfgRaw = await loadJSON(configAbsPath);
  ok(isMfConfig(cfgRaw), 'Invalid millenium-falcon.json');
  const { routes_db: dbRelPath, ...milleniumFalcon } = cfgRaw;

  const dbAbsPath = resolve(configAbsPath, '..', dbRelPath);
  return {
    paths: {
      dbRel: dbRelPath,
      db: dbAbsPath,
      configRel: configRelPath,
      config: configAbsPath,
    },
    milleniumFalcon,
  };
};
