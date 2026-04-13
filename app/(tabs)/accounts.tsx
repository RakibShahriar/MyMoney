import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AccountCard } from '@/src/components/cards/AccountCard';
import { AccountForm } from '@/src/components/forms/AccountForm';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useAccounts } from '@/src/features/accounts/hooks/useAccounts';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useAccountStore } from '@/src/store/accountStore';

export default function AccountsScreen() {
  const theme = useAppTheme();
  const { accounts, loading, error, saveAccount } = useAccounts();
  const activeAccountId = useAccountStore((state) => state.activeAccountId);
  const setActiveAccountId = useAccountStore((state) => state.setActiveAccountId);
  const [showForm, setShowForm] = useState(false);

  return (
    <ScreenContainer
      header={
        <SectionHeader
          title="Accounts"
          subtitle="Manage wallets, bank accounts, and dashboard focus"
          actionLabel={showForm ? 'Close' : 'New'}
          onActionPress={() => setShowForm((value) => !value)}
        />
      }>
      {activeAccountId ? (
        <View style={[styles.notice, { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border }]}>
          <Text style={[styles.noticeText, { color: theme.colors.text }]}>
            Dashboard is filtered to one active account.
          </Text>
          <PrimaryButton label="Clear Filter" variant="ghost" onPress={() => setActiveAccountId(undefined)} />
        </View>
      ) : null}

      {showForm ? (
        <View style={[styles.formWrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <AccountForm
            onSubmit={async (input) => {
              await saveAccount(input);
              setShowForm(false);
            }}
          />
        </View>
      ) : null}

      {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading accounts...</Text> : null}
      {error ? <EmptyState title="Accounts unavailable" description={error} /> : null}
      {!loading && !error && accounts.length === 0 ? (
        <EmptyState title="No accounts yet" description="Create your first cash wallet or bank account." />
      ) : null}

      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          selected={account.id === activeAccountId}
          onPress={() => {
            setActiveAccountId(account.id);
            router.push({ pathname: '/account-details', params: { id: account.id } });
          }}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  notice: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  noticeText: {
    fontSize: 14,
  },
  formWrap: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  message: {
    fontSize: 14,
  },
});
