import { isRecord } from './isRecord';

/**
 * Bounty hunter present at a given planet on a given day
 */
export type BountyHunterAt = {
  planet: string;
  day: number;
};

export const isBountyHunterAt = (it: unknown): it is BountyHunterAt =>
  isRecord(it) && typeof it.planet === 'string' && typeof it.day === 'number';
