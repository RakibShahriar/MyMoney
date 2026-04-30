import type * as SQLite from 'expo-sqlite';

import { ALL_EXPENSES_CATEGORY_ID } from '@/src/constants/categories';
import { getDatabase } from '@/src/db/database';
import { budgetQueries } from '@/src/db/queries/budgetQueries';
import type { Budget, BudgetInput, BudgetProgress } from '@/src/types/budget';
import { getBudgetProgress } from '@/src/utils/math';

const resolveDb = async (database?: SQLite.SQLiteDatabase) => database ?? getDatabase();

const mapBudget = (row: Record<string, unknown>): Budget => ({
  id: String(row.id),
  category_id: String(row.category_id),
  amount: Number(row.amount ?? 0),
  month: Number(row.month ?? 0),
  year: Number(row.year ?? 0),
  created_at: String(row.created_at),
  updated_at: String(row.updated_at),
});

const mapBudgetProgress = (row: Record<string, unknown>): BudgetProgress => {
  const amount = Number(row.amount ?? 0);
  const spent = Number(row.spent ?? 0);

  return {
    ...mapBudget(row),
    category_name: String(row.category_name),
    category_icon: String(row.category_icon),
    category_color: String(row.category_color),
    spent,
    remaining: amount - spent,
    progress: getBudgetProgress(spent, amount),
  };
};

export const budgetRepository = {
  async listByMonth(month: number, year: number, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const rows = ((await db.getAllAsync(budgetQueries.list, [
      ALL_EXPENSES_CATEGORY_ID,
      month,
      year,
      ALL_EXPENSES_CATEGORY_ID,
    ])) as Record<string, unknown>[]) ?? [];
    return rows.map(mapBudgetProgress);
  },

  async findById(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(budgetQueries.byId, [id])) as Record<string, unknown> | null;
    return row ? mapBudget(row) : null;
  },

  async findByCategoryPeriod(
    categoryId: string,
    month: number,
    year: number,
    database?: SQLite.SQLiteDatabase
  ) {
    const db = await resolveDb(database);
    const row = (await db.getFirstAsync(budgetQueries.byCategoryPeriod, [
      categoryId,
      month,
      year,
    ])) as Record<string, unknown> | null;
    return row ? mapBudget(row) : null;
  },

  async upsert(input: BudgetInput & { id: string }, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    const timestamp = new Date().toISOString();
    await db.runAsync(budgetQueries.upsert, [
      input.id,
      input.category_id,
      input.amount,
      input.month,
      input.year,
      timestamp,
      timestamp,
    ]);
  },

  async delete(id: string, database?: SQLite.SQLiteDatabase) {
    const db = await resolveDb(database);
    await db.runAsync(budgetQueries.delete, [id]);
  },
};
