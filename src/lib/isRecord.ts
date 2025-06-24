export const isRecord = (it: unknown): it is Record<string, unknown> =>
  typeof it === 'object' && it !== null;
