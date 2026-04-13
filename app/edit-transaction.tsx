import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { TransactionForm } from '@/src/components/forms/TransactionForm';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useAccounts } from '@/src/features/accounts/hooks/useAccounts';
import { useCategories } from '@/src/features/categories/hooks/useCategories';
import { useTransactionDetails } from '@/src/features/transactions/hooks/useTransactionDetails';
import { useTransactions } from '@/src/features/transactions/hooks/useTransactions';

export default function EditTransactionScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const transactionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { transaction, loading, error } = useTransactionDetails(transactionId);
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { saveTransaction, deleteTransaction } = useTransactions();

  return (
    <ScreenContainer header={<SectionHeader title="Edit Transaction" subtitle="Update or remove this record" />}>
      {loading ? <EmptyState title="Loading transaction" description="Fetching transaction details..." /> : null}
      {error ? <EmptyState title="Transaction unavailable" description={error} /> : null}
      {!loading && !error && !transaction ? (
        <EmptyState title="Transaction not found" description="This record may have been removed already." />
      ) : null}
      {transaction ? (
        <View style={styles.content}>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            initialValue={{ ...transaction, note: transaction.note ?? undefined }}
            submitLabel="Update transaction"
            onSubmit={async (input) => {
              await saveTransaction({ ...input, id: transaction.id });
              router.back();
            }}
          />
          <PrimaryButton
            label="Delete Transaction"
            variant="danger"
            onPress={async () => {
              await deleteTransaction(transaction.id);
              router.back();
            }}
          />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
});
