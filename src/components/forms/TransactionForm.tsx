import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { DateField } from '@/src/components/common/DateField';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { TextField } from '@/src/components/common/TextField';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import type { Category } from '@/src/types/category';
import type { Account } from '@/src/types/account';
import type { TransactionInput } from '@/src/types/transaction';
import { getToday } from '@/src/utils/date';

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  initialValue?: Partial<TransactionInput>;
  onSubmit: (input: TransactionInput) => Promise<void>;
  submitLabel?: string;
}

export const TransactionForm = ({
  accounts,
  categories,
  initialValue,
  onSubmit,
  submitLabel = 'Save transaction',
}: TransactionFormProps) => {
  const theme = useAppTheme();
  const typeOptions: { label: string; value: TransactionInput['type'] }[] = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];
  const [type, setType] = useState<TransactionInput['type']>(initialValue?.type ?? 'expense');
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );
  const accountOptions = useMemo(
    () => accounts.map((account) => ({ label: account.name, value: account.id })),
    [accounts]
  );
  const categoryOptions = useMemo(
    () => filteredCategories.map((category) => ({ label: category.name, value: category.id })),
    [filteredCategories]
  );
  const [accountId, setAccountId] = useState(initialValue?.account_id ?? accountOptions[0]?.value ?? '');
  const [categoryId, setCategoryId] = useState(initialValue?.category_id ?? '');
  const [amount, setAmount] = useState(String(initialValue?.amount ?? ''));
  const [transactionDate, setTransactionDate] = useState(initialValue?.transaction_date ?? getToday());
  const [note, setNote] = useState(initialValue?.note ?? '');
  const [saving, setSaving] = useState(false);
  const hasAccounts = accountOptions.length > 0;
  const hasCategories = categoryOptions.length > 0;

  useEffect(() => {
    if (!filteredCategories.some((category) => category.id === categoryId)) {
      setCategoryId(filteredCategories[0]?.id ?? '');
    }
  }, [categoryId, filteredCategories]);

  useEffect(() => {
    if (!accounts.some((account) => account.id === accountId)) {
      setAccountId(accounts[0]?.id ?? '');
    }
  }, [accountId, accounts]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await onSubmit({
        id: initialValue?.id,
        account_id: accountId,
        category_id: categoryId,
        type,
        amount: Number(amount || 0),
        note,
        transaction_date: transactionDate,
      });
    } catch (error) {
      Alert.alert('Unable to save transaction', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <ChipSelector label="Type" options={typeOptions} value={type} onChange={setType} />
      <ChipSelector label="Account" options={accountOptions} value={accountId} onChange={setAccountId} />
      <ChipSelector label="Category" options={categoryOptions} value={categoryId} onChange={setCategoryId} />
      {!hasAccounts ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          Create an account first so transactions have somewhere to live.
        </Text>
      ) : null}
      {hasAccounts && !hasCategories ? (
        <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
          No {type} categories are available yet. Add one from Settings.
        </Text>
      ) : null}
      <TextField label="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />
      <DateField
        label="Date"
        value={transactionDate}
        onChange={setTransactionDate}
        hint="Tap to choose the transaction date"
      />
      <TextField
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
        multiline
        style={styles.noteInput}
      />
      <PrimaryButton
        label={saving ? 'Saving...' : submitLabel}
        onPress={handleSubmit}
        disabled={saving || !hasAccounts || !hasCategories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  noteInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
