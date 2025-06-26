import { expect, it, describe } from 'vitest';
import { PlanetRoute } from '@/domain/PlanetRoute';
import { SpaceshipParams } from '@/domain/MfConfig';
import { findPath } from './findPath';
import { EmpireIntel } from '@/domain/EmpireIntel';

const createRoutes = (
  routesData: Array<[string, string, number]>,
): PlanetRoute[] =>
  routesData.map(([origin, destination, time]) => ({
    origin: origin,
    destination: destination,
    travel_time: time,
  }));

const exampleRoutes = createRoutes([
  ['Tatooine', 'Dagobah', 6],
  ['Dagobah', 'Endor', 4],
  ['Dagobah', 'Hoth', 1],
  ['Hoth', 'Endor', 1],
  ['Tatooine', 'Hoth', 6],
]);

const exampleMfConfig: SpaceshipParams = {
  autonomy: 6,
  departure: 'Tatooine',
  arrival: 'Endor',
};

const getExampleEmpireIntel = (countdown: number): EmpireIntel => ({
  countdown,
  bounty_hunters: [
    { planet: 'Hoth', day: 6 },
    { planet: 'Hoth', day: 7 },
    { planet: 'Hoth', day: 8 },
  ],
});

describe('findPath', () => {
  describe('Examples', () => {
    it('1: Cannot reach Endor in time (too slow)', () => {
      expect(
        findPath(exampleRoutes, exampleMfConfig, getExampleEmpireIntel(7)).odds,
      ).toBe(0);
    });

    it('2: Reachable with 2 encounters', () => {
      expect(
        findPath(exampleRoutes, exampleMfConfig, getExampleEmpireIntel(8)).odds,
      ).toBe(0.81);
    });

    it('3: Reachable with 1 encounter', () => {
      expect(
        findPath(exampleRoutes, exampleMfConfig, getExampleEmpireIntel(9)).odds,
      ).toBe(0.9);
    });

    it('4: Reachable with 0 encounters by waiting', () => {
      expect(
        findPath(exampleRoutes, exampleMfConfig, getExampleEmpireIntel(10))
          .odds,
      ).toBe(1);
    });
  });

  // --- Custom Non-Trivial Cases ---
  it('Direct path, no bounty hunters', () => {
    expect(
      findPath(
        createRoutes([['Coruscant', 'Naboo', 4]]),
        {
          autonomy: 10,
          departure: 'Coruscant',
          arrival: 'Naboo',
        },
        { countdown: 5, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Path requires refuel, bounty hunters on refuel planet', () => {
    expect(
      findPath(
        createRoutes([
          ['Kashyyyk', 'Dantooine', 3], // Day 3, Fuel 0
          ['Dantooine', 'Felucia', 2],
        ]),
        {
          autonomy: 3,
          departure: 'Kashyyyk',
          arrival: 'Felucia',
        },
        {
          countdown: 6,
          bounty_hunters: [{ planet: 'Dantooine', day: 3 }],
        },
      ).odds,
    ).toBe(0.9);
  });

  it('Path requires refuel, bounty hunters on arrival after refuel', () => {
    expect(
      findPath(
        createRoutes([
          ['Kashyyyk', 'Dantooine', 3],
          ['Dantooine', 'Felucia', 2],
        ]),
        {
          autonomy: 3,
          departure: 'Kashyyyk',
          arrival: 'Felucia',
        },
        {
          countdown: 6,
          bounty_hunters: [{ planet: 'Felucia', day: 6 }],
        },
      ).odds,
    ).toBe(0.9);
  });

  it('Avoid bounty hunters by waiting at departure planet', () => {
    expect(
      findPath(
        createRoutes([['Tatooine', 'Endor', 4]]),
        {
          autonomy: 5,
          departure: 'Tatooine',
          arrival: 'Endor',
        },
        {
          countdown: 8,
          bounty_hunters: [{ planet: 'Endor', day: 0 }],
        },
      ).odds,
    ).toBe(1);
  });

  it('Avoid bounty hunters by waiting at an intermediate planet', () => {
    expect(
      findPath(
        createRoutes([
          ['Tatooine', 'Alderaan', 3],
          ['Alderaan', 'Endor', 3],
        ]),
        {
          autonomy: 5,
          departure: 'Tatooine',
          arrival: 'Endor',
        },
        {
          countdown: 8,
          bounty_hunters: [{ planet: 'Alderaan', day: 3 }],
        },
      ).odds,
    ).toBe(1);
  });

  it('Multiple encounters on a single path', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 3],
          ['B', 'C', 2],
        ]),
        {
          autonomy: 3,
          departure: 'A',
          arrival: 'C',
        },
        {
          countdown: 6,
          bounty_hunters: [
            { planet: 'B', day: 3 }, // Encounter on travel A->B
            { planet: 'B', day: 4 }, // Encounter on refuel at B
          ],
        },
      ).odds,
    ).toBe(0.81);
  });

  it('Impossible countdown (too short)', () => {
    expect(
      findPath(
        createRoutes([['Alpha', 'Omega', 5]]), // Takes 5 days
        {
          autonomy: 10,
          departure: 'Alpha',
          arrival: 'Omega',
        },
        { countdown: 3, bounty_hunters: [] },
      ).odds,
    ).toBe(0);
  });

  it('Arrival exactly on countdown', () => {
    expect(
      findPath(
        createRoutes([['Alpha', 'Omega', 5]]),
        {
          autonomy: 10,
          departure: 'Alpha',
          arrival: 'Omega',
        },
        { countdown: 5, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Very limited autonomy requiring frequent refuels', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 1],
          ['B', 'C', 1],
          ['C', 'D', 1],
        ]),
        {
          autonomy: 1,
          departure: 'A',
          arrival: 'D',
        },
        { countdown: 10, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Highly constrained autonomy, but refuel not needed for a short hop', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 2], // Day 2, Fuel 1
          ['B', 'C', 1], // Day 3, Fuel 0
        ]),
        {
          autonomy: 3,
          departure: 'A',
          arrival: 'C',
        },
        { countdown: 5, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Disconnected graph', () => {
    expect(
      findPath(
        createRoutes([
          ['Earth', 'Moon', 1],
          ['Jupiter', 'Saturn', 2],
        ]),
        {
          autonomy: 10,
          departure: 'Earth',
          arrival: 'Mars',
        },
        { countdown: 100, bounty_hunters: [] },
      ).odds,
    ).toBe(0);
  });

  it('No routes provided', () => {
    expect(
      findPath(
        [],
        {
          autonomy: 10,
          departure: 'A',
          arrival: 'B',
        },
        { countdown: 10, bounty_hunters: [] },
      ).odds,
    ).toBe(0);
  });

  it('Routes with invalid TRAVEL_TIME (should be ignored)', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 0], // Invalid
          ['B', 'C', -5], // Invalid
          ['A', 'C', 2], // Valid direct path
        ]),
        {
          autonomy: 10,
          departure: 'A',
          arrival: 'C',
        },
        { countdown: 10, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Path with cycles, but shortest path is direct', () => {
    expect(
      findPath(
        createRoutes([
          ['Start', 'Middle1', 1],
          ['Middle1', 'Middle2', 1],
          ['Middle2', 'Start', 1], // Cycle
          ['Start', 'End', 3], // Direct path
        ]),
        {
          autonomy: 10,
          departure: 'Start',
          arrival: 'End',
        },
        { countdown: 10, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Multiple paths with same min encounters, choose faster time', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 2],
          ['B', 'D', 2], // Path 1: A-B-D = 4 days
          ['A', 'C', 1],
          ['C', 'D', 4], // Path 2: A-C-D = 5 days
        ]),
        {
          autonomy: 10,
          departure: 'A',
          arrival: 'D',
        },
        { countdown: 10, bounty_hunters: [] },
      ).odds,
    ).toBe(1);
  });

  it('Multiple paths with different encounters, choose min encounters', () => {
    expect(
      findPath(
        createRoutes([
          ['A', 'B', 2], // Path 1: A->B (D2). Encounter 1. B->D (D2+3=D5). Total 1 encounter.
          ['B', 'D', 3],
          ['A', 'C', 4], // Path 2: A->C (D4). C->D (D4+1=D5). Total 0 encounters.
          ['C', 'D', 1],
        ]),
        {
          autonomy: 10,
          departure: 'A',
          arrival: 'D',
        },
        {
          countdown: 10,
          bounty_hunters: [{ planet: 'B', day: 2 }],
        },
      ).odds,
    ).toBe(1);
  });

  it('Countdown is 1, BH on departure at day 0', () => {
    expect(
      findPath(
        createRoutes([['A', 'B', 1]]),
        {
          autonomy: 5,
          departure: 'A',
          arrival: 'B',
        },
        { countdown: 1, bounty_hunters: [{ planet: 'A', day: 0 }] },
      ).odds,
    ).toBe(0.9);
  });

  describe('Countdown is 0', () => {
    it('no BH', () => {
      expect(
        findPath(
          createRoutes([['A', 'B', 2]]),
          {
            autonomy: 5,
            departure: 'A',
            arrival: 'B',
          },
          { countdown: 0, bounty_hunters: [] },
        ).odds,
      ).toBe(0);
    });

    it('BH on day 0 at departure', () => {
      expect(
        findPath(
          createRoutes([['A', 'B', 2]]),
          {
            autonomy: 5,
            departure: 'A',
            arrival: 'B',
          },
          {
            countdown: 0,
            bounty_hunters: [{ planet: 'A', day: 0 }],
          },
        ).odds,
      ).toBe(0);
    });
  });

  describe('Countdown is 1, arrival is departure', () => {
    it('day 0, no encounters', () => {
      expect(
        findPath(
          [],
          {
            autonomy: 10,
            departure: 'Home',
            arrival: 'Home',
          },
          { countdown: 1, bounty_hunters: [] },
        ).odds,
      ).toBe(1);
    });

    it('bounty hunter at day 0', () => {
      expect(
        findPath(
          [],
          {
            autonomy: 10,
            departure: 'Home',
            arrival: 'Home',
          },
          {
            countdown: 1,
            bounty_hunters: [{ planet: 'Home', day: 0 }],
          },
        ).odds,
      ).toBe(0.9);
    });
  });

  describe('Countdown is 0, arrival is departure', () => {
    it('no BH', () => {
      expect(
        findPath(
          [],
          {
            autonomy: 5,
            departure: 'A',
            arrival: 'A',
          },
          { countdown: 0, bounty_hunters: [] },
        ).odds,
      ).toBe(1);
    });

    it('BH on day 0 at departure', () => {
      expect(
        findPath(
          [],
          {
            autonomy: 5,
            departure: 'A',
            arrival: 'A',
          },
          {
            countdown: 0,
            bounty_hunters: [{ planet: 'A', day: 0 }],
          },
        ).odds,
      ).toBe(0.9);
    });
  });

  it('Comprehensive test: Complex graph, many BH', () => {
    const { odds, path } = findPath(
      createRoutes(
        [
          'AB1 BC1 CD1 DE1 EF1 FG1 GH1 HI1 IJ1 JK1 KL1 LM1 MN1 NO1 OP1 PQ1 QR1 RS1 ST1 TU1 UV1 VW1 WX1 XY1 YZ1 AC2 BD2 CE2 DF2 EG2 FH2 GI2 HJ2 IK2 JL2 KM2 LN2 MO2 NP2 OQ2 PR2 QS2 RT2 SU2 TV2 UW2 VX2 WY2 XZ2 AE3 BF3 CG3 DH3 EI3 FJ3 GK3 HL3 IM3 JN3 KO3 LP3 MQ3 NR3 OS3 PT3 QU3 RV3 SW3 TX3 UY3 VZ3 AF5 GM5 MS5 SY5',
        ]
          .join(' ')
          .split(' ')
          .map((str) => {
            const letters = str.split('');
            const origin = letters.shift();
            const destination = letters.shift();
            return [
              String(origin),
              String(destination),
              Number(letters.join('')),
            ];
          }),
      ),
      {
        autonomy: 10,
        departure: 'A',
        arrival: 'Z',
      },
      {
        countdown: 20,
        bounty_hunters: [
          'A0 A1 A2 B2 B3 B4 C4 C5 C6 D5 D6 D7 E3 E6 E7 E8 F8 F9 F10 G9 G10 G11 H11 H12 H13 I12 I13 I14 J7 J14 J15 J16 K10 K12 K14 L11 L13 L15 M12 M14 M16 N13 N15 N17 O14 O16 O18 P16 P17 P18 Q13 Q17 Q18 Q19 R18 R19 R20 S19 S20 T20 U15 U17 U19 V16 V18 V20 W17 W19 X18 X20 Y19 Z10 Z11 Z12 Z13 Z14 Z15 Z16 Z17 Z18 Z19 Z20',
        ]
          .join(' ')
          .split(' ')
          .map((str) => {
            const letters = str.split('');
            const planet = String(letters.shift());
            const day = Number(letters.join(''));
            return { planet, day };
          }),
      },
    );
    expect(Math.round(odds * 1000) / 10).toBe(72.9);
  });

  it('Direct path, bounty hunters on arrival planet', () => {
    const { odds, path } = findPath(
      createRoutes([['Coruscant', 'Naboo', 4]]),
      {
        autonomy: 10,
        departure: 'Coruscant',
        arrival: 'Naboo',
      },
      {
        countdown: 4,
        bounty_hunters: [{ planet: 'Naboo', day: 4 }],
      },
    );
    expect(odds).toBe(0.9);
  });
});
