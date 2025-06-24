import { isRecord } from '@/lib/isRecord';

/**
 * Millenium Falcon config
 */
export type SpaceshipParams = {
  autonomy: number;
  departure: string;
  arrival: string;
};

export interface MfConfig extends SpaceshipParams {
  routes_db: string;
}

export const isMfConfig = (cfg: unknown): cfg is MfConfig =>
  isRecord(cfg) &&
  typeof cfg.autonomy === 'number' &&
  typeof cfg.departure === 'string' &&
  typeof cfg.arrival === 'string' &&
  typeof cfg.routes_db === 'string';
