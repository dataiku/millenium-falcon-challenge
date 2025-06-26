// Original implementation from description
// export function calculateCaptureProbabilityOriginal(k: number) {
//     if (k < 1) {
//         return 0;
//     }
//     let totalProb = 0;
//     for (let i = 0; i < k; i++) {
//         const stepProb = 9 ** i / 10 ** (i + 1);
//         totalProb += stepProb;
//     }
//     return totalProb;
// }

/**
 * Calculates the total probability of being captured based on the number of bounty hunter encounters (k).
 * Formula: 1/10 + 9/10^2 + 9^2/10^3 + ... + 9^{k-1}/10^k
 * @param k The number of times the Bounty Hunter tried to capture the Millennium Falcon.
 * @returns The total capture probability.
 */
export const calculateSuccessProbability = (
  /**
   * The number of encounters with a bounty hunter.
   * The value must be more than 0.
   */
  encounters: number,
  /**
   * The probablity of encountering a bounty hunter.
   * The value must be between 0 and 1.
   */
  probablity: number,
) => (encounters < 1 ? 1 : (1 - probablity) ** encounters);
