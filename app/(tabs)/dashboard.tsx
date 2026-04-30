import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AccountBarChart } from '@/src/components/charts/AccountBarChart';
import { CashFlowChart } from '@/src/components/charts/CashFlowChart';
import { ExpensePieChart } from '@/src/components/charts/ExpensePieChart';
import { BudgetCard } from '@/src/components/cards/BudgetCard';
import { TransactionCard } from '@/src/components/cards/TransactionCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PeriodNavigator } from '@/src/components/common/PeriodNavigator';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useDashboard } from '@/src/features/analytics/hooks/useDashboard';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import { useAppStore } from '@/src/store/appStore';
import { formatCurrency } from '@/src/utils/currency';
import { shiftMonth } from '@/src/utils/date';

export default function DashboardScreen() {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const setSelectedPeriod = useAppStore((state) => state.setSelectedPeriod);
  const { dashboard, loading, error } = useDashboard();

  const movePeriod = (delta: number) => {
    const next = shiftMonth(selectedMonth, selectedYear, delta);
    setSelectedPeriod(next.month, next.year);
  };

  return (
    <ScreenContainer
      swipeNavigation={{ nextHref: '/(tabs)/transactions' }}
      header={
        <>
          <SectionHeader title="MyMoney" subtitle="Offline-first overview for your selected month" />
          <PeriodNavigator
            month={selectedMonth}
            year={selectedYear}
            onPrevious={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
          />
        </>
      }>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(dashboard?.summary.totalIncome ?? 0, currency)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Expense</Text>
          <Text style={[styles.altSummaryValue, { color: theme.colors.text }]}>
            {formatCurrency(dashboard?.summary.totalExpense ?? 0, currency)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textMuted }]}>Net</Text>
          <Text style={[styles.altSummaryValue, { color: theme.colors.text }]}>
            {formatCurrency(dashboard?.summary.netCashflow ?? 0, currency, { showSign: true })}
          </Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <PrimaryButton label="Add Transaction" onPress={() => router.push('/add-transaction')} />
        <PrimaryButton label="Create Budget" variant="secondary" onPress={() => router.push('/create-budget')} />
      </View>

      {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading dashboard...</Text> : null}
      {error ? <EmptyState title="Dashboard unavailable" description={error} /> : null}

      {dashboard ? (
        <>
          <SectionHeader title="Expense Breakdown" subtitle="Where your money went this month" />
          {dashboard.expenseBreakdown.length > 0 ? (
            <ExpensePieChart data={dashboard.expenseBreakdown} />
          ) : (
            <EmptyState title="No expenses yet" description="Add a transaction to see your category split." />
          )}

          <SectionHeader title="Cash Flow" subtitle="Income versus expense over recent months" />
          <CashFlowChart data={dashboard.cashFlow} />

          <SectionHeader title="Accounts" subtitle="Current balance across your wallets and banks" />
          <AccountBarChart accounts={dashboard.accounts} />

          <SectionHeader title="Budgets" actionLabel="See all" onActionPress={() => router.push('/(tabs)/budget')} />
          {dashboard.budgets.length > 0 ? (
            dashboard.budgets.slice(0, 3).map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onPress={() => router.push({ pathname: '/create-budget', params: { id: budget.id } })}
              />
            ))
          ) : (
            <EmptyState title="No budgets set" description="Create a budget to track category limits." />
          )}

          <SectionHeader title="Recent Transactions" actionLabel="Open list" onActionPress={() => router.push('/(tabs)/transactions')} />
          {dashboard.recentTransactions.length > 0 ? (
            dashboard.recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => router.push({ pathname: '/edit-transaction', params: { id: transaction.id } })}
              />
            ))
          ) : (
            <EmptyState title="No transactions yet" description="Use the add button to record your first income or expense." />
          )}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    gap: 12,
  },
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  summaryLabel: {
    color: '#DDF7F1',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  altSummaryValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  quickActions: {
    gap: 10,
  },
  message: {
    fontSize: 14,
  },
});
