import type * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/src/db/database';
import { transactionQueries } from '@/src/db/queries/transactionQueries';
import type { TransactionFilters, TransactionInput, TransactionListItem } from '@/src/types/transaction';
import { toSqlMonthBounds } from '@/src/utils/date';

const resolveDb = async (database?: SQLite.SQLiteDatabase) => database ?? getDatabase();

const mapTransaction = (row: Record<string, unknown>): TransactionListItem => ({
  id: String(row.id),
  account_id: String(row.account_id),
  category_id: String(row.category_id),
  type: row.type as TransactionListItem['type'],
  amount: Number(row.amount ?? 0),
  note: row.note ? String(row.note) : null,
  transaction_date: String(row.transaction_date),
  created_at: String(row.created_at),
  updated_at: String(row.updated_at),
  account_name: String(row.account_name),
  account_icon: String(row.account_icon),
  category_name: String(row.category_name),
  category_icon: String(row.category_icon),
  category_color: String(row.category_color),
});

const buildListQuery = (filters: TransactionFilters) => {
  const conditions: string[] = [];
  const params: (string | number | null)[] = [];

  if (filters.month && filters.year) {
    const bounds = toSqlMonthBounds(filters.month, filters.year);
    conditions.push('t.transaction_date BETWEEN ? AND ?');
    params.push(bounds.start, bounds.end);
  }

  if (filters.accountId) {
    conditions.push('t.account_id = ?');
    params.push(filters.accountId);
  }

  if (filters.categoryId) {
    conditions.push('t.category_id = ?');
    params.push(filters.categoryId);
  }

  if (filters.type && filters.type !== 'all') {
    conditions.push('t.type = ?');
    params.push(filters.type);
  }

  if (filters.search) {
    conditions.push(
      "(LOWER(COALESCE(t.note, '')) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(a.name) LIKE ?)"
    );
    const search = `%${filters.search.toLowerCase()}%`;
    params.push(search, search, search);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `${transactionQueries.listBase} ${whereClause} ORDER BY t.transaction_date DESC, t.created_at DESC;`;

  return { sql, params };
};

export const transactionRepository = {
  async list(filters: TransactionFilters = {}, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const { sql, params } = buildListQuery(filters);
    const rows = ((await db.getAllAsync(sql, params)) as Record<string, unknown>[]) ?? [];
    return rows.map(mapTransaction);
  },

  async findById(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(transactionQueries.byId, [id])) as Record<string, unknown> | null;
    return row ? mapTransaction(row) : null;
  },

  async create(input: TransactionInput & { id: string }, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const timestamp = new Date().toISOString();
    await db.runAsync(transactionQueries.insert, [
      input.id,
      input.account_id,
      input.category_id,
      input.type,
      input.amount,
      input.note ?? null,
      input.transaction_date,
      timestamp,
      timestamp,
    ]);
  },

  async update(input: TransactionInput & { id: string }, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(transactionQueries.update, [
      input.account_id,
      input.category_id,
      input.type,
      input.amount,
      input.note ?? null,
      input.transaction_date,
      new Date().toISOString(),
      input.id,
    ]);
  },

  async delete(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(transactionQueries.delete, [id]);
  },
};
