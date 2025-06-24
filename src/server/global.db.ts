import { panic } from '@/lib/panic';
import { DatabaseSync } from 'node:sqlite';

export type DbClient = DatabaseSync;
declare global {
  var dbClient: DbClient | undefined;
}

export const db = () => globalThis.dbClient || panic('DB not initialized');

export const initDB = async (dbPath: string) => {
  const dbClient = new DatabaseSync(dbPath);
  globalThis.dbClient = dbClient;
  return dbClient;
};
