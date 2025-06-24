import { readFileSync } from 'node:fs';

export const loadJSON = async (path: string) =>
  JSON.parse(await readFileSync(path, 'utf8'));
