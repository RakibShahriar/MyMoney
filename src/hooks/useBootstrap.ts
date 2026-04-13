import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { initializeDatabase } from '@/src/db/migrations/init';
import { settingsService } from '@/src/features/settings/services/settingsService';
import { useAppStore } from '@/src/store/appStore';
import { resolveThemeMode } from '@/src/theme';

export const useBootstrap = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const setCurrencySettings = useAppStore((state) => state.setCurrencySettings);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setReady(false);
    setError(null);

    const load = async () => {
      try {
        await Promise.race([
          initializeDatabase(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Startup timed out. Please try again.')), 15000)
          ),
        ]);
        const settings = await settingsService.getSettings();

        if (!active) {
          return;
        }

        setThemeMode(settings.theme_mode);
        setCurrencySettings({
          currencyCode: settings.currency_code,
          currencySymbol: settings.currency_symbol,
          decimalPlaces: settings.decimal_places,
        });
        setReady(true);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to prepare app.');
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [attempt, setCurrencySettings, setThemeMode]);

  const isDark = useMemo(
    () => resolveThemeMode(themeMode, systemColorScheme === 'dark'),
    [systemColorScheme, themeMode]
  );

  return {
    ready,
    error,
    isDark,
    retry: () => setAttempt((value) => value + 1),
  };
};
