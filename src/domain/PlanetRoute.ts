import { isRecord } from '@/lib/isRecord';

export type PlanetRoute = {
  origin: string;
  destination: string;
  travel_time: number;
};

export const isPlanetRoute = (it: unknown): it is PlanetRoute =>
  isRecord(it) &&
  typeof it.origin === 'string' &&
  typeof it.destination === 'string' &&
  typeof it.travel_time === 'number';
