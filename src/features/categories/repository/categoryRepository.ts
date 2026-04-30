import type * as SQLite from 'expo-sqlite';

import { getDatabase } from '@/src/db/database';
import { categoryQueries } from '@/src/db/queries/categoryQueries';
import { ALL_EXPENSES_CATEGORY_ID } from '@/src/constants/categories';
import type { Category, CategoryInput } from '@/src/types/category';
import type { TransactionType } from '@/src/types/common';

const resolveDb = async (database?: SQLite.SQLiteDatabase) => database ?? getDatabase();

const mapCategory = (row: Record<string, unknown>): Category => ({
  id: String(row.id),
  name: String(row.name),
  type: row.type as TransactionType,
  icon: String(row.icon),
  color: String(row.color),
  created_at: String(row.created_at),
  updated_at: String(row.updated_at),
});

export const categoryRepository = {
  async list(type?: TransactionType, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const sql = type ? categoryQueries.byType : categoryQueries.list;
    const rows = (
      type
        ? await db.getAllAsync(sql, [type, ALL_EXPENSES_CATEGORY_ID])
        : await db.getAllAsync(sql, [ALL_EXPENSES_CATEGORY_ID])
    ) as Record<string, unknown>[];
    return rows.map(mapCategory);
  },

  async findById(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(categoryQueries.byId, [id])) as Record<string, unknown> | null;
    return row ? mapCategory(row) : null;
  },

  async create(input: CategoryInput & { id: string }, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const timestamp = new Date().toISOString();
    await db.runAsync(categoryQueries.insert, [
      input.id,
      input.name,
      input.type,
      input.icon,
      input.color,
      timestamp,
      timestamp,
    ]);
  },

  async update(input: CategoryInput & { id: string }, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(categoryQueries.update, [
      input.name,
      input.type,
      input.icon,
      input.color,
      new Date().toISOString(),
      input.id,
    ]);
  },

  async delete(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(categoryQueries.delete, [id]);
  },

  async countUsage(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(
      `
        SELECT (
          (SELECT COUNT(*) FROM transactions WHERE category_id = ?)
          +
          (SELECT COUNT(*) FROM budgets WHERE category_id = ?)
        ) AS count;
      `,
      [id, id]
    )) as { count?: number } | null;
    return Number(row?.count ?? 0);
  },
};
