import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { TransactionCard } from '@/src/components/cards/TransactionCard';
import { ChipSelector } from '@/src/components/common/ChipSelector';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PeriodNavigator } from '@/src/components/common/PeriodNavigator';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { TextField } from '@/src/components/common/TextField';
import { useAccounts } from '@/src/features/accounts/hooks/useAccounts';
import { useCategories } from '@/src/features/categories/hooks/useCategories';
import { useTransactions } from '@/src/features/transactions/hooks/useTransactions';
import { transactionTypeOptions } from '@/src/features/transactions/utils';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useAppStore } from '@/src/store/appStore';
import { useTransactionStore } from '@/src/store/transactionStore';
import { shiftMonth } from '@/src/utils/date';

export default function TransactionsScreen() {
  const theme = useAppTheme();
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const setSelectedPeriod = useAppStore((state) => state.setSelectedPeriod);
  const type = useTransactionStore((state) => state.type);
  const search = useTransactionStore((state) => state.search);
  const categoryId = useTransactionStore((state) => state.categoryId);
  const accountId = useTransactionStore((state) => state.accountId);
  const setType = useTransactionStore((state) => state.setType);
  const setSearch = useTransactionStore((state) => state.setSearch);
  const setCategoryId = useTransactionStore((state) => state.setCategoryId);
  const setAccountId = useTransactionStore((state) => state.setAccountId);
  const { transactions, loading, error } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories(type === 'all' ? undefined : type);

  const movePeriod = (delta: number) => {
    const next = shiftMonth(selectedMonth, selectedYear, delta);
    setSelectedPeriod(next.month, next.year);
  };

  const accountOptions = [{ label: 'All Accounts', value: 'all' }, ...accounts.map((account) => ({ label: account.name, value: account.id }))];
  const categoryOptions = [{ label: 'All Categories', value: 'all' }, ...categories.map((category) => ({ label: category.name, value: category.id }))];

  return (
    <ScreenContainer
      header={
        <>
          <SectionHeader
            title="Transactions"
            subtitle="Filter and review every income and expense"
            actionLabel="Add"
            onActionPress={() => router.push('/add-transaction')}
          />
          <PeriodNavigator
            month={selectedMonth}
            year={selectedYear}
            onPrevious={() => movePeriod(-1)}
            onNext={() => movePeriod(1)}
          />
        </>
      }>
      <TextField label="Search" value={search} onChangeText={setSearch} placeholder="Search notes, accounts, categories" />
      <ChipSelector label="Type" options={transactionTypeOptions} value={type} onChange={setType} />
      <ChipSelector
        label="Account"
        options={accountOptions}
        value={accountId ?? 'all'}
        onChange={(value) => setAccountId(value === 'all' ? undefined : value)}
      />
      <ChipSelector
        label="Category"
        options={categoryOptions}
        value={categoryId ?? 'all'}
        onChange={(value) => setCategoryId(value === 'all' ? undefined : value)}
      />

      {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading transactions...</Text> : null}
      {error ? <EmptyState title="Transactions unavailable" description={error} /> : null}
      {!loading && !error && transactions.length === 0 ? (
        <EmptyState title="No transactions found" description="Try changing your filters or add a new transaction." />
      ) : null}

      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onPress={() => router.push({ pathname: '/edit-transaction', params: { id: transaction.id } })}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
  },
});
