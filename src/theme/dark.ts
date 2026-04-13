import { palette } from '@/src/constants/colors';

export const darkTheme = {
  mode: 'dark' as const,
  colors: {
    background: '#09121B',
    surface: '#101C29',
    surfaceMuted: '#132435',
    text: '#F7FAFC',
    textMuted: '#A7B9CB',
    border: '#213447',
    primary: palette.mint,
    primarySoft: '#18342F',
    secondary: palette.gold,
    accent: palette.coral,
    success: '#4BC7AA',
    danger: '#FF8A94',
    warning: '#FFCB65',
    tabInactive: '#6C8196',
  },
};
