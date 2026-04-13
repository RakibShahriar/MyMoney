import { create } from 'zustand';

import { defaultCurrency } from '@/src/constants/currency';
import type { ThemeMode } from '@/src/types/common';
import { getCurrentMonth, getCurrentYear } from '@/src/utils/date';

interface AppStoreState {
  selectedMonth: number;
  selectedYear: number;
  dataVersion: number;
  themeMode: ThemeMode;
  currencyCode: string;
  currencySymbol: string;
  decimalPlaces: number;
  setSelectedPeriod: (month: number, year: number) => void;
  touchData: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setCurrencySettings: (input: {
    currencyCode: string;
    currencySymbol: string;
    decimalPlaces: number;
  }) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  selectedMonth: getCurrentMonth(),
  selectedYear: getCurrentYear(),
  dataVersion: 0,
  themeMode: 'system',
  currencyCode: defaultCurrency.code,
  currencySymbol: defaultCurrency.symbol,
  decimalPlaces: defaultCurrency.decimals,
  setSelectedPeriod: (month, year) => set({ selectedMonth: month, selectedYear: year }),
  touchData: () => set((state) => ({ dataVersion: state.dataVersion + 1 })),
  setThemeMode: (themeMode) => set({ themeMode }),
  setCurrencySettings: ({ currencyCode, currencySymbol, decimalPlaces }) =>
    set({ currencyCode, currencySymbol, decimalPlaces }),
}));
