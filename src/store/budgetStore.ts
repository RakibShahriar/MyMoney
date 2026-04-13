import { create } from 'zustand';

import { getCurrentMonth, getCurrentYear } from '@/src/utils/date';

interface BudgetStoreState {
  month: number;
  year: number;
  setPeriod: (month: number, year: number) => void;
}

export const useBudgetStore = create<BudgetStoreState>((set) => ({
  month: getCurrentMonth(),
  year: getCurrentYear(),
  setPeriod: (month, year) => set({ month, year }),
}));
