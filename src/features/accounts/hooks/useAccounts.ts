import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { accountService } from '@/src/features/accounts/services/accountService';
import { useAppStore } from '@/src/store/appStore';
import type { AccountInput, AccountSummary } from '@/src/types/account';

export const useAccounts = () => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const touchData = useAppStore((state) => state.touchData);
  const [accounts, setAccounts] = useState<AccountSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAccounts(await accountService.listAccounts());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  const saveAccount = useCallback(
    async (input: AccountInput) => {
      const result = await accountService.saveAccount(input);
      touchData();
      await load();
      return result;
    },
    [load, touchData]
  );

  const deleteAccount = useCallback(
    async (accountId: string) => {
      await accountService.deleteAccount(accountId);
      touchData();
      await load();
    },
    [load, touchData]
  );

  return { accounts, loading, error, refresh: load, saveAccount, deleteAccount };
};
