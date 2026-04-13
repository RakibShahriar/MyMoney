import { palette } from '@/src/constants/colors';

export const lightTheme = {
  mode: 'light' as const,
  colors: {
    background: '#F5F7FB',
    surface: palette.white,
    surfaceMuted: '#EDF2F8',
    text: palette.ink,
    textMuted: palette.slate,
    border: '#D8E1EB',
    primary: palette.teal,
    primarySoft: '#D9F1EF',
    secondary: palette.gold,
    accent: palette.coral,
    success: palette.success,
    danger: palette.danger,
    warning: palette.warning,
    tabInactive: '#88A0B8',
  },
};
