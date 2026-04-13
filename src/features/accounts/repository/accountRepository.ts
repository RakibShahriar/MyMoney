import type * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/src/db/database';
import { accountQueries } from '@/src/db/queries/accountQueries';
import type { Account, AccountInput, AccountSummary } from '@/src/types/account';

const resolveDb = async (database?: SQLite.SQLiteDatabase) => database ?? getDatabase();

const mapAccountSummary = (row: Record<string, unknown>): AccountSummary => ({
  id: String(row.id),
  name: String(row.name),
  type: row.type as Account['type'],
  initial_balance: Number(row.initial_balance ?? 0),
  current_balance: Number(row.current_balance ?? 0),
  icon: String(row.icon),
  created_at: String(row.created_at),
  updated_at: String(row.updated_at),
  transaction_count: Number(row.transaction_count ?? 0),
});

export const accountRepository = {
  async list(database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const rows = ((await db.getAllAsync(accountQueries.list)) as Record<string, unknown>[]) ?? [];
    return rows.map(mapAccountSummary);
  },

  async findById(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(accountQueries.byId, [id])) as Record<string, unknown> | null;
    return row ? mapAccountSummary(row) : null;
  },

  async create(
    input: AccountInput & { id: string },
    currentBalance: number,
    database?: SQLite.SQLiteDatabase
  ) {
    const db = await resolveDb(database);
    const timestamp = new Date().toISOString();
    await db.runAsync(accountQueries.insert, [
      input.id,
      input.name,
      input.type,
      input.initial_balance,
      currentBalance,
      input.icon,
      timestamp,
      timestamp,
    ]);
  },

  async update(account: Account, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(accountQueries.update, [
      account.name,
      account.type,
      account.initial_balance,
      account.current_balance,
      account.icon,
      new Date().toISOString(),
      account.id,
    ]);
  },

  async delete(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(accountQueries.delete, [id]);
  },

  async adjustBalance(id: string, delta: number, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(accountQueries.updateBalance, [delta, new Date().toISOString(), id]);
  },

  async countTransactions(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM transactions WHERE account_id = ?;',
      [id]
    )) as { count?: number } | null;
    return Number(row?.count ?? 0);
  },
};
