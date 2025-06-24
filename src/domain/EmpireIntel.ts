import { isRecord } from '@/lib/isRecord';
import { isBountyHunterAt } from './BountyHunterAt';

/**
 * Intel about the Empire
 */
export type EmpireIntel = {
  countdown: number;
  bounty_hunters: {
    planet: string;
    day: number;
  }[];
};

export const isEmpireIntel = (intel: unknown): intel is EmpireIntel =>
  isRecord(intel) &&
  typeof intel.countdown === 'number' &&
  Array.isArray(intel.bounty_hunters) &&
  intel.bounty_hunters.every(isBountyHunterAt);
