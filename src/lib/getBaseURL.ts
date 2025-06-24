import { resolve } from 'node:path';
import { cwd } from 'node:process';

export const getBaseURL = (relPath: string) => resolve(cwd(), relPath);
