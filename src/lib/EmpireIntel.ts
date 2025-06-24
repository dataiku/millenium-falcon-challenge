export const isEmpireIntel = (intel: unknown): intel is EmpireIntel =>
  typeof intel === 'object' &&
  intel !== null &&
  'countdown' in intel &&
  typeof intel.countdown === 'number' &&
  'bounty_hunters' in intel &&
  Array.isArray(intel.bounty_hunters) &&
  intel.bounty_hunters.every(
    (it) =>
      typeof it === 'object' &&
      it !== null &&
      'planet' in it &&
      typeof it.planet === 'string' &&
      'day' in it &&
      typeof it.day === 'number',
  );

export type EmpireIntel = {
  countdown: number;
  bounty_hunters: {
    planet: string;
    day: number;
  }[];
};
