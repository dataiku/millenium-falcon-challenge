import { readFileSync } from 'node:fs';

export const loadJSON = async (path: string): Promise<unknown> =>
  JSON.parse(await readFileSync(path, 'utf8'));
