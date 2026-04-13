import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import type { AccountSummary } from '@/src/types/account';
import { formatCurrency } from '@/src/utils/currency';

interface AccountCardProps {
  account: AccountSummary;
  selected?: boolean;
  onPress?: () => void;
}

export const AccountCard = ({ account, selected = false, onPress }: AccountCardProps) => {
  const theme = useAppTheme();
  const currency = useCurrencySettings();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceMuted }]}>
        <Ionicons name={account.icon as never} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{account.name}</Text>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
          {account.type} · {account.transaction_count} transactions
        </Text>
      </View>
      <Text style={[styles.balance, { color: theme.colors.text }]}>
        {formatCurrency(account.current_balance, currency)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  balance: {
    fontSize: 15,
    fontWeight: '700',
  },
});
