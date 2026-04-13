import { create } from 'zustand';

interface AccountStoreState {
  activeAccountId?: string;
  setActiveAccountId: (accountId?: string) => void;
}

export const useAccountStore = create<AccountStoreState>((set) => ({
  activeAccountId: undefined,
  setActiveAccountId: (activeAccountId) => set({ activeAccountId }),
}));
