import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColors } from '@/src/constants/colors';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import type { TransactionListItem } from '@/src/types/transaction';
import { formatCurrency } from '@/src/utils/currency';
import { toReadableDate } from '@/src/utils/date';

interface TransactionCardProps {
  transaction: TransactionListItem;
  onPress?: () => void;
}

export const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const amountColor = transaction.type === 'income' ? semanticColors.income : semanticColors.expense;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${transaction.category_color}22` }]}>
        <Ionicons name={transaction.category_icon as never} size={18} color={transaction.category_color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{transaction.category_name}</Text>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
          {transaction.account_name} · {toReadableDate(transaction.transaction_date)}
        </Text>
        {transaction.note ? <Text style={[styles.note, { color: theme.colors.textMuted }]}>{transaction.note}</Text> : null}
      </View>
      <View style={styles.amountColumn}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {formatCurrency(
            transaction.type === 'income' ? transaction.amount : -transaction.amount,
            currency,
            { showSign: true }
          )}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
  },
  note: {
    fontSize: 12,
  },
  amountColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
