import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useAppStore } from '@/src/store/appStore';
import { getAppTheme, resolveThemeMode } from '@/src/theme';

export const useAppTheme = () => {
  const themeMode = useAppStore((state) => state.themeMode);
  const colorScheme = useColorScheme();

  return useMemo(
    () => getAppTheme(resolveThemeMode(themeMode, colorScheme === 'dark')),
    [colorScheme, themeMode]
  );
};
