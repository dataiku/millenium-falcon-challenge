import * as sqlite from 'node:sqlite';

export const readDbRoutes = async (dbPath: string) => {
  const db = new sqlite.DatabaseSync(dbPath);
  return db.prepare('SELECT * FROM routes').all();
};
