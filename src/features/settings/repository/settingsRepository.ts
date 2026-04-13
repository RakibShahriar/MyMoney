import { defaultCurrency } from '@/src/constants/currency';
import type { AppSettings, SettingsInput } from '@/src/features/settings/types';
import { getDatabase } from '@/src/db/database';

const mapSettings = (row: Record<string, unknown>): AppSettings => ({
  id: Number(row.id ?? 1),
  currency_code: String(row.currency_code ?? defaultCurrency.code),
  currency_symbol: String(row.currency_symbol ?? defaultCurrency.symbol),
  decimal_places: Number(row.decimal_places ?? defaultCurrency.decimals),
  theme_mode: row.theme_mode as AppSettings['theme_mode'],
  lock_enabled: Boolean(row.lock_enabled),
  created_at: String(row.created_at ?? new Date().toISOString()),
  updated_at: String(row.updated_at ?? new Date().toISOString()),
});

export const settingsRepository = {
  async getSettings() {
    const db = await getDatabase();
    const row = (await db.getFirstAsync('SELECT * FROM settings WHERE id = 1;')) as
      | Record<string, unknown>
      | null;

    if (!row) {
      return {
        id: 1,
        currency_code: defaultCurrency.code,
        currency_symbol: defaultCurrency.symbol,
        decimal_places: defaultCurrency.decimals,
        theme_mode: 'system' as const,
        lock_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return mapSettings(row);
  },

  async updateSettings(input: SettingsInput) {
    const db = await getDatabase();
    await db.runAsync(
      `
        UPDATE settings
        SET currency_code = ?, currency_symbol = ?, decimal_places = ?, theme_mode = ?, lock_enabled = ?, updated_at = ?
        WHERE id = 1;
      `,
      [
        input.currency_code,
        input.currency_symbol,
        input.decimal_places,
        input.theme_mode,
        input.lock_enabled ? 1 : 0,
        new Date().toISOString(),
      ]
    );

    return this.getSettings();
  },
};
