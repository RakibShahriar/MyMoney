import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { transactionService } from '@/src/features/transactions/services/transactionService';
import { useAppStore } from '@/src/store/appStore';
import type { TransactionListItem } from '@/src/types/transaction';

export const useTransactionDetails = (transactionId?: string) => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const [transaction, setTransaction] = useState<TransactionListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!transactionId) {
      setTransaction(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTransaction(await transactionService.getTransaction(transactionId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load transaction.');
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  return { transaction, loading, error, refresh: load };
};
