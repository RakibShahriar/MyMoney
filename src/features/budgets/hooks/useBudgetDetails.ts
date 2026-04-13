import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { budgetService } from '@/src/features/budgets/services/budgetService';
import { useAppStore } from '@/src/store/appStore';
import type { Budget } from '@/src/types/budget';

export const useBudgetDetails = (budgetId?: string) => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!budgetId) {
      setBudget(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setBudget(await budgetService.getBudget(budgetId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load budget.');
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  return { budget, loading, error, refresh: load };
};
