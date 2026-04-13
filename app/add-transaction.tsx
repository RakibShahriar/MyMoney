import { router } from 'expo-router';

import { TransactionForm } from '@/src/components/forms/TransactionForm';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useAccounts } from '@/src/features/accounts/hooks/useAccounts';
import { useCategories } from '@/src/features/categories/hooks/useCategories';
import { useTransactions } from '@/src/features/transactions/hooks/useTransactions';

export default function AddTransactionScreen() {
  const { accounts, loading: accountsLoading } = useAccounts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { saveTransaction } = useTransactions();

  const loading = accountsLoading || categoriesLoading;

  return (
    <ScreenContainer header={<SectionHeader title="Add Transaction" subtitle="Record a new income or expense" />} scrollable>
      {loading ? (
        <EmptyState title="Loading form" description="Preparing accounts and categories..." />
      ) : accounts.length === 0 ? (
        <EmptyState title="No accounts available" description="Create an account first, then come back to add a transaction." />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories available" description="Add at least one income or expense category from Settings." />
      ) : (
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={async (input) => {
            await saveTransaction(input);
            router.back();
          }}
        />
      )}
    </ScreenContainer>
  );
}
