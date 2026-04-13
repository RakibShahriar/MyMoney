import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { budgetService } from '@/src/features/budgets/services/budgetService';
import { useAppStore } from '@/src/store/appStore';
import type { BudgetInput, BudgetProgress } from '@/src/types/budget';

export const useBudgets = (month: number, year: number) => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const touchData = useAppStore((state) => state.touchData);
  const [budgets, setBudgets] = useState<BudgetProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setBudgets(await budgetService.listBudgets(month, year));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  const saveBudget = useCallback(
    async (input: BudgetInput) => {
      const result = await budgetService.saveBudget(input);
      touchData();
      await load();
      return result;
    },
    [load, touchData]
  );

  const deleteBudget = useCallback(
    async (budgetId: string) => {
      await budgetService.deleteBudget(budgetId);
      touchData();
      await load();
    },
    [load, touchData]
  );

  return { budgets, loading, error, refresh: load, saveBudget, deleteBudget };
};
