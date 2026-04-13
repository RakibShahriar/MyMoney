import { create } from 'zustand';

import type { TransactionType } from '@/src/types/common';

interface TransactionStoreState {
  type: TransactionType | 'all';
  search: string;
  categoryId?: string;
  accountId?: string;
  setType: (type: TransactionType | 'all') => void;
  setSearch: (value: string) => void;
  setCategoryId: (value?: string) => void;
  setAccountId: (value?: string) => void;
  reset: () => void;
}

const initialState = {
  type: 'all' as const,
  search: '',
  categoryId: undefined,
  accountId: undefined,
};

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  ...initialState,
  setType: (type) => set({ type }),
  setSearch: (search) => set({ search }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setAccountId: (accountId) => set({ accountId }),
  reset: () => set(initialState),
}));
