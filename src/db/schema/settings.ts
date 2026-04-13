export const createSettingsTable = `
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
    currency_code TEXT NOT NULL,
    currency_symbol TEXT NOT NULL,
    decimal_places INTEGER NOT NULL DEFAULT 2,
    theme_mode TEXT NOT NULL CHECK(theme_mode IN ('light', 'dark', 'system')),
    lock_enabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;
