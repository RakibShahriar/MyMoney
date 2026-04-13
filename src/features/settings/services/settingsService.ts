import { currencyOptions, defaultCurrency } from '@/src/constants/currency';
import { settingsRepository } from '@/src/features/settings/repository/settingsRepository';
import type { SettingsInput } from '@/src/features/settings/types';
import { settingsInputSchema } from '@/src/utils/validation';

export const settingsService = {
  async getSettings() {
    return settingsRepository.getSettings();
  },

  async updateSettings(input: SettingsInput) {
    const validated = settingsInputSchema.parse(input);
    return settingsRepository.updateSettings({
      currency_code: validated.currency_code,
      currency_symbol: validated.currency_symbol,
      decimal_places: validated.decimal_places,
      theme_mode: validated.theme_mode,
      lock_enabled: validated.lock_enabled,
    });
  },

  getCurrencyDetails(code: string) {
    return currencyOptions.find((option) => option.code === code) ?? defaultCurrency;
  },
};
