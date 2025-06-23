// Original implementation from description
// export function calculateCaptureProbabilityOriginal(k: number) {
//     if (k < 1) {
//         return 0;
//     }
//     let totalProb = 0;
//     for (let i = 0; i <= k; i++) {
//         const stepProb = 9 ** i / 10 ** (i + 1);
//         totalProb += stepProb;
//     }
//     return totalProb;
// }

const getSequenceProbability = (k: number, probablity = 0.1) =>
  k < 1 ? 1 : (1 - probablity) ** k;
const roundUp10 = (n: number, factor10: number) =>
  Math.ceil(n * factor10) / factor10;
const roundUp = (n: number, factor10 = 5) => roundUp10(n, 10 ** factor10);

/**
 * Calculates the total probability of being captured based on the number of bounty hunter encounters (k).
 * Formula: 1/10 + 9/10^2 + 9^2/10^3 + ... + 9^{k-1}/10^k
 * @param k The number of times the Bounty Hunter tried to capture the Millennium Falcon.
 * @returns The total capture probability.
 */
export const calculateSuccessProbability = (
  encounters: number,
  probablity = 0.1,
  precision = 5,
) => roundUp(getSequenceProbability(encounters, probablity), precision);
