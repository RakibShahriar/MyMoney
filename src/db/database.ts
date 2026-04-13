import * as SQLite from 'expo-sqlite';

import { DATABASE_NAME } from '@/src/constants/app';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync('PRAGMA foreign_keys = ON;');
      return db;
    });
  }

  return databasePromise;
};

export const runInTransaction = async <T>(
  callback: (database: SQLite.SQLiteDatabase) => Promise<T>
) => {
  const database = await getDatabase();
  await database.execAsync('BEGIN IMMEDIATE TRANSACTION;');

  try {
    const result = await callback(database);
    await database.execAsync('COMMIT;');
    return result;
  } catch (error) {
    await database.execAsync('ROLLBACK;');
    throw error;
  }
};
