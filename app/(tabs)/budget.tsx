import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BudgetCard } from '@/src/components/cards/BudgetCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PeriodNavigator } from '@/src/components/common/PeriodNavigator';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useBudgets } from '@/src/features/budgets/hooks/useBudgets';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import { useAppStore } from '@/src/store/appStore';
import { formatCurrency } from '@/src/utils/currency';
import { shiftMonth } from '@/src/utils/date';

export default function BudgetScreen() {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const setSelectedPeriod = useAppStore((state) => state.setSelectedPeriod);
  const { budgets, loading, error } = useBudgets(selectedMonth, selectedYear);

  const movePeriod = (delta: number) => {
    const next = shiftMonth(selectedMonth, selectedYear, delta);
    setSelectedPeriod(next.month, next.year);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return (
    <ScreenContainer
      swipeNavigation={{ previousHref: '/(tabs)/transactions', nextHref: '/(tabs)/accounts' }}
      header={
        <>
          <SectionHeader title="Budgets" subtitle="Track monthly category caps" actionLabel="Create" onActionPress={() => router.push('/create-budget')} />
          <PeriodNavigator
            month={selectedMonth}
            year={selectedYear}
            onPrevious={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
          />
        </>
      }>
      <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Planned</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          {formatCurrency(totalBudget, currency)}
        </Text>
        <Text style={[styles.summaryMeta, { color: theme.colors.textMuted }]}>
          {formatCurrency(totalSpent, currency)} spent this month
        </Text>
      </View>

      {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading budgets...</Text> : null}
      {error ? <EmptyState title="Budget data unavailable" description={error} /> : null}
      {!loading && !error && budgets.length === 0 ? (
        <EmptyState title="No budgets yet" description="Create a category budget to start tracking your spending limits." />
      ) : null}

      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onPress={() => router.push({ pathname: '/create-budget', params: { id: budget.id } })}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  summaryMeta: {
    fontSize: 13,
  },
  message: {
    fontSize: 14,
  },
});
