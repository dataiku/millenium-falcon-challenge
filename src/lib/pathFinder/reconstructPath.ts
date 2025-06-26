import { TravelState, TravelStateMap } from './TravelState';

/**
 * Reconstructs the optimal path by backtracking from the final state using predecessor pointers.
 */
export const reconstructPath = (
  finalStateKey: string,
  statesMap: TravelStateMap,
) => {
  let curItem = statesMap.get(finalStateKey);
  if (!curItem) {
    throw new Error(
      `Path reconstruction error: Missing final state info for ${finalStateKey}`,
    );
  }
  const path: TravelState[] = [];

  while (curItem) {
    path.push(curItem);
    const { prevKey } = curItem;
    if (!prevKey) {
      break;
    }
    curItem = statesMap.get(prevKey);
  }

  return path;
};
