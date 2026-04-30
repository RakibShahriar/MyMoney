import { useLocalSearchParams, router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { BudgetForm } from '@/src/components/forms/BudgetForm';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useBudgets } from '@/src/features/budgets/hooks/useBudgets';
import { useBudgetDetails } from '@/src/features/budgets/hooks/useBudgetDetails';
import { useCategories } from '@/src/features/categories/hooks/useCategories';
import { useAppStore } from '@/src/store/appStore';

export default function CreateBudgetScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const budgetId = Array.isArray(params.id) ? params.id[0] : params.id;
  const selectedMonth = useAppStore((state) => state.selectedMonth);
  const selectedYear = useAppStore((state) => state.selectedYear);
  const { categories, loading: categoriesLoading } = useCategories('expense');
  const { budget, loading: budgetLoading, error } = useBudgetDetails(budgetId);
  const { saveBudget, deleteBudget } = useBudgets(selectedMonth, selectedYear);

  const loading = categoriesLoading || budgetLoading;

  return (
    <ScreenContainer header={<SectionHeader title={budgetId ? 'Edit Budget' : 'Create Budget'} subtitle="Set a monthly category target" />}>
      {loading ? <EmptyState title="Loading budget form" description="Preparing data..." /> : null}
      {error ? <EmptyState title="Budget unavailable" description={error} /> : null}
      {!loading && !error ? (
        <View style={styles.content}>
          <BudgetForm
            categories={categories}
            initialValue={budget ?? { month: selectedMonth, year: selectedYear }}
            onSubmit={async (input) => {
              await saveBudget({ ...input, id: budget?.id ?? input.id });
              router.back();
            }}
          />
          {budget ? (
            <PrimaryButton
              label="Delete Budget"
              variant="danger"
              onPress={() =>
                Alert.alert('Delete budget?', 'This budget will be removed for the selected month.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      void (async () => {
                        await deleteBudget(budget.id);
                        router.back();
                      })();
                    },
                  },
                ])
              }
            />
          ) : null}
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
