import { defaultCategories } from '@/src/constants/categories';
import { defaultCurrency } from '@/src/constants/currency';
import { DEFAULT_ACCOUNT_ICON, DEFAULT_ACCOUNT_NAME } from '@/src/constants/app';
import { getDatabase } from '@/src/db/database';
import { createAccountsTable } from '@/src/db/schema/accounts';
import { createBudgetsTable } from '@/src/db/schema/budgets';
import { createCategoriesTable } from '@/src/db/schema/categories';
import { createSettingsTable } from '@/src/db/schema/settings';
import { createTransactionsTable } from '@/src/db/schema/transactions';
import { createId } from '@/src/utils/id';

const tableStatements = [
  createAccountsTable,
  createCategoriesTable,
  createTransactionsTable,
  createBudgetsTable,
  createSettingsTable,
];

export const initializeDatabase = async () => {
  const db = await getDatabase();

  for (const statement of tableStatements) {
    await db.execAsync(statement);
  }

  const categoryCount = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories;'
  );

  if ((categoryCount?.count ?? 0) === 0) {
    const timestamp = new Date().toISOString();

    for (const category of defaultCategories) {
      await db.runAsync(
        `
          INSERT INTO categories (id, name, type, icon, color, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [
          createId(),
          category.name,
          category.type,
          category.icon,
          category.color,
          timestamp,
          timestamp,
        ]
      );
    }
  }

  const settingsRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM settings;');

  if ((settingsRow?.count ?? 0) === 0) {
    const timestamp = new Date().toISOString();
    await db.runAsync(
      `
        INSERT INTO settings (
          id, currency_code, currency_symbol, decimal_places, theme_mode, lock_enabled, created_at, updated_at
        ) VALUES (1, ?, ?, ?, 'system', 0, ?, ?);
      `,
      [defaultCurrency.code, defaultCurrency.symbol, defaultCurrency.decimals, timestamp, timestamp]
    );
  }

  const accountCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM accounts;');

  if ((accountCount?.count ?? 0) === 0) {
    const timestamp = new Date().toISOString();
    await db.runAsync(
      `
        INSERT INTO accounts (
          id, name, type, initial_balance, current_balance, icon, created_at, updated_at
        ) VALUES (?, ?, 'cash', 0, 0, ?, ?, ?);
      `,
      [createId(), DEFAULT_ACCOUNT_NAME, DEFAULT_ACCOUNT_ICON, timestamp, timestamp]
    );
  }
};
