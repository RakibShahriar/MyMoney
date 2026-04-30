import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { TextField } from '@/src/components/common/TextField';
import { ALL_EXPENSES_CATEGORY_ID } from '@/src/constants/categories';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import type { BudgetInput } from '@/src/types/budget';
import type { Category } from '@/src/types/category';

interface BudgetFormProps {
  categories: Category[];
  initialValue?: Partial<BudgetInput>;
  onSubmit: (input: BudgetInput) => Promise<void>;
}

export const BudgetForm = ({ categories, initialValue, onSubmit }: BudgetFormProps) => {
  const theme = useAppTheme();
  const categoryOptions = useMemo(
    () => [
      { label: 'All Expenses', value: ALL_EXPENSES_CATEGORY_ID },
      ...categories.map((category) => ({ label: category.name, value: category.id })),
    ],
    [categories]
  );
  const [categoryId, setCategoryId] = useState(initialValue?.category_id ?? categoryOptions[0]?.value ?? '');
  const [amount, setAmount] = useState(String(initialValue?.amount ?? '0'));
  const [month, setMonth] = useState(String(initialValue?.month ?? new Date().getMonth() + 1));
  const [year, setYear] = useState(String(initialValue?.year ?? new Date().getFullYear()));
  const [saving, setSaving] = useState(false);
  const hasCategories = categoryOptions.length > 0;

  useEffect(() => {
    if (!categoryOptions.some((option) => option.value === categoryId)) {
      setCategoryId(categoryOptions[0]?.value ?? '');
    }
  }, [categoryId, categoryOptions]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await onSubmit({
        id: initialValue?.id,
        category_id: categoryId,
        amount: Number(amount || 0),
        month: Number(month),
        year: Number(year),
      });
    } catch (error) {
      Alert.alert('Unable to save budget', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <ChipSelector label="Category" options={categoryOptions} value={categoryId} onChange={setCategoryId} />
      {!hasCategories ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          Create at least one expense category before saving a budget.
        </Text>
      ) : null}
      {hasCategories ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          Choose a single expense category or use All Expenses for a full monthly spending cap.
        </Text>
      ) : null}
      <TextField label="Budget amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextField label="Month" value={month} onChangeText={setMonth} keyboardType="number-pad" />
        </View>
        <View style={styles.half}>
          <TextField label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" />
        </View>
      </View>
      <PrimaryButton
        label={saving ? 'Saving...' : 'Save budget'}
        onPress={handleSubmit}
        disabled={saving || !hasCategories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
