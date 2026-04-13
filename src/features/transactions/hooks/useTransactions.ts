import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { transactionService } from '@/src/features/transactions/services/transactionService';
import { useAppStore } from '@/src/store/appStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import type { TransactionInput, TransactionListItem } from '@/src/types/transaction';

export const useTransactions = () => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const touchData = useAppStore((state) => state.touchData);
  const { type, search, categoryId, accountId } = useTransactionStore();
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTransactions(
        await transactionService.listTransactions({
          month: selectedMonth,
          year: selectedYear,
          type,
          search,
          categoryId,
          accountId,
        })
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [accountId, categoryId, search, selectedMonth, selectedYear, type]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  const saveTransaction = useCallback(
    async (input: TransactionInput) => {
      const result = await transactionService.saveTransaction(input);
      touchData();
      await load();
      return result;
    },
    [load, touchData]
  );

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      await transactionService.deleteTransaction(transactionId);
      touchData();
      await load();
    },
    [load, touchData]
  );

  return { transactions, loading, error, refresh: load, saveTransaction, deleteTransaction };
};
