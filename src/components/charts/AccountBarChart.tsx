import { StyleSheet, Text, View } from 'react-native';

import type { AccountSummary } from '@/src/types/account';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import { formatCurrency } from '@/src/utils/currency';

interface AccountBarChartProps {
  accounts: AccountSummary[];
}

export const AccountBarChart = ({ accounts }: AccountBarChartProps) => {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const maxValue = Math.max(...accounts.map((account) => account.current_balance), 1);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {accounts.map((account) => (
        <View key={account.id} style={styles.row}>
          <View style={styles.copy}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{account.name}</Text>
            <Text style={[styles.value, { color: theme.colors.textMuted }]}>
              {formatCurrency(account.current_balance, currency)}
            </Text>
          </View>
          <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.max((account.current_balance / maxValue) * 100, 8)}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  row: {
    gap: 8,
  },
  copy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
