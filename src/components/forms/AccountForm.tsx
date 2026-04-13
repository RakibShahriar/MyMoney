import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { TextField } from '@/src/components/common/TextField';
import { accountTypeOptions } from '@/src/features/accounts/utils';
import type { AccountInput } from '@/src/types/account';

interface AccountFormProps {
  initialValue?: Partial<AccountInput>;
  onSubmit: (input: AccountInput) => Promise<void>;
  submitLabel?: string;
}

export const AccountForm = ({ initialValue, onSubmit, submitLabel = 'Save account' }: AccountFormProps) => {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [type, setType] = useState<AccountInput['type']>(initialValue?.type ?? 'cash');
  const [initialBalance, setInitialBalance] = useState(String(initialValue?.initial_balance ?? '0'));
  const [icon, setIcon] = useState(initialValue?.icon ?? 'wallet-outline');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await onSubmit({
        id: initialValue?.id,
        name,
        type,
        initial_balance: Number(initialBalance || 0),
        icon,
      });
    } catch (error) {
      Alert.alert('Unable to save account', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextField label="Account name" value={name} onChangeText={setName} placeholder="Main wallet" />
      <ChipSelector label="Type" options={accountTypeOptions} value={type} onChange={setType} />
      <TextField
        label="Starting balance"
        value={initialBalance}
        onChangeText={setInitialBalance}
        keyboardType="decimal-pad"
        placeholder="0.00"
      />
      <TextField
        label="Icon name"
        value={icon}
        onChangeText={setIcon}
        placeholder="wallet-outline"
        hint="Uses Ionicons names like wallet-outline or card-outline"
      />
      <PrimaryButton label={saving ? 'Saving...' : submitLabel} onPress={handleSubmit} disabled={saving} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
});
