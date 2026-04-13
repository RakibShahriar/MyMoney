import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TransactionCard } from '@/src/components/cards/TransactionCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useAccountDetails } from '@/src/features/accounts/hooks/useAccountDetails';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import { formatCurrency } from '@/src/utils/currency';

export default function AccountDetailsScreen() {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const accountId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { account, transactions, loading, error } = useAccountDetails(accountId);

  return (
    <ScreenContainer header={<SectionHeader title="Account Details" subtitle="Balance and activity for the selected account" />}>
      {loading ? <EmptyState title="Loading account" description="Fetching balances and transactions..." /> : null}
      {error ? <EmptyState title="Account unavailable" description={error} /> : null}
      {!loading && !error && !account ? (
        <EmptyState title="Account not found" description="This account may have been removed." />
      ) : null}

      {account ? (
        <>
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{account.name}</Text>
            <Text style={[styles.balance, { color: theme.colors.text }]}>
              {formatCurrency(account.current_balance, currency)}
            </Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
              {account.type} · {account.transaction_count} transactions
            </Text>
          </View>

          <SectionHeader title="Transactions" />
          {transactions.length > 0 ? (
            transactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} />)
          ) : (
            <EmptyState title="No transactions yet" description="Transactions for this account will appear here." />
          )}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  balance: {
    fontSize: 28,
    fontWeight: '800',
  },
  meta: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
