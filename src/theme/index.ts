import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { darkTheme } from '@/src/theme/dark';
import { lightTheme } from '@/src/theme/light';
import type { ThemeMode } from '@/src/types/common';

export type AppTheme = typeof lightTheme;

export const getAppTheme = (isDark: boolean) => (isDark ? darkTheme : lightTheme);

export const getNavigationTheme = (isDark: boolean): Theme => {
  const appTheme = getAppTheme(isDark);
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      border: appTheme.colors.border,
      primary: appTheme.colors.primary,
      text: appTheme.colors.text,
      notification: appTheme.colors.accent,
    },
  };
};

export const resolveThemeMode = (mode: ThemeMode, systemIsDark: boolean) =>
  mode === 'system' ? systemIsDark : mode === 'dark';
