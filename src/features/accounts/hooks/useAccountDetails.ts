import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { accountService } from '@/src/features/accounts/services/accountService';
import { useAppStore } from '@/src/store/appStore';
import type { AccountSummary } from '@/src/types/account';
import type { TransactionListItem } from '@/src/types/transaction';

export const useAccountDetails = (accountId?: string) => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accountId) {
      setAccount(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await accountService.getAccountDetails(accountId);
      setAccount(result.account);
      setTransactions(result.transactions);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load account.');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  return { account, transactions, loading, error, refresh: load };
};
