import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { analyticsService } from '@/src/features/analytics/services/analyticsService';
import type { DashboardData } from '@/src/features/analytics/types';
import { useAccountStore } from '@/src/store/accountStore';
import { useAppStore } from '@/src/store/appStore';

export const useDashboard = () => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const activeAccountId = useAccountStore((state) => state.activeAccountId);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setDashboard(await analyticsService.getDashboardData(selectedMonth, selectedYear, activeAccountId));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [activeAccountId, selectedMonth, selectedYear]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  return { dashboard, loading, error, refresh: load };
};
