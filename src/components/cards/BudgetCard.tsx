import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import type { BudgetProgress } from '@/src/types/budget';
import { formatCurrency } from '@/src/utils/currency';

interface BudgetCardProps {
  budget: BudgetProgress;
  onPress?: () => void;
}

export const BudgetCard = ({ budget, onPress }: BudgetCardProps) => {
  const theme = useAppTheme();
  const currency = useCurrencySettings();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${budget.category_color}22` }]}>
          <Ionicons name={budget.category_icon as never} size={18} color={budget.category_color} />
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{budget.category_name}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            {formatCurrency(budget.spent, currency)} spent of {formatCurrency(budget.amount, currency)}
          </Text>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceMuted }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(budget.progress * 100, 100)}%`,
              backgroundColor: budget.category_color,
            },
          ]}
        />
      </View>
      <Text style={[styles.remaining, { color: theme.colors.textMuted }]}>
        {formatCurrency(budget.remaining, currency)} remaining
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  header: {
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
  copy: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
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
  remaining: {
    fontSize: 12,
  },
});
