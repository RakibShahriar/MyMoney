import type { ThemeMode } from '@/src/types/common';

export interface AppSettings {
  id: number;
  currency_code: string;
  currency_symbol: string;
  decimal_places: number;
  theme_mode: ThemeMode;
  lock_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SettingsInput {
  currency_code: string;
  currency_symbol: string;
  decimal_places: number;
  theme_mode: ThemeMode;
  lock_enabled: boolean;
}
