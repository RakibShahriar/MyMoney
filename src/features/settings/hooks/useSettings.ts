import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import { settingsService } from '@/src/features/settings/services/settingsService';
import { useAppStore } from '@/src/store/appStore';
import type { AppSettings, SettingsInput } from '@/src/features/settings/types';

export const useSettings = () => {
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const setCurrencySettings = useAppStore((state) => state.setCurrencySettings);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await settingsService.getSettings();
      setThemeMode(result.theme_mode);
      setCurrencySettings({
        currencyCode: result.currency_code,
        currencySymbol: result.currency_symbol,
        decimalPlaces: result.decimal_places,
      });
      setSettings(result);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, [setCurrencySettings, setThemeMode]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const saveSettings = useCallback(
    async (input: SettingsInput) => {
      const result = await settingsService.updateSettings(input);
      setThemeMode(result.theme_mode);
      setCurrencySettings({
        currencyCode: result.currency_code,
        currencySymbol: result.currency_symbol,
        decimalPlaces: result.decimal_places,
      });
      setSettings(result);
      return result;
    },
    [setCurrencySettings, setThemeMode]
  );

  return { settings, loading, error, refresh: load, saveSettings };
};
