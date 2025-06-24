import { BountyHunterAt } from '@/domain/BountyHunterAt';

const coordId = (planet: string, day: number) => [planet, day].join(',');

/**
 * Efficient presence checking
 */
export class BountyHunterSet {
  private set = new Set<string>();
  add = (bh: BountyHunterAt) => {
    this.set.add(coordId(bh.planet, bh.day));
    return this;
  };
  addAll = (bhs: BountyHunterAt[]) => {
    bhs.forEach(this.add);
    return this;
  };
  has = (planet: string, day: number) => this.set.has(coordId(planet, day));
}
