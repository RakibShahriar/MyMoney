import { StyleSheet, Text, View } from 'react-native';

import { getLargestValue } from '@/src/features/analytics/utils';
import type { CashFlowPoint } from '@/src/features/analytics/types';
import { useAppTheme } from '@/src/hooks/useAppTheme';

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export const CashFlowChart = ({ data }: CashFlowChartProps) => {
  const theme = useAppTheme();
  const maxValue = getLargestValue(data.flatMap((point) => [point.income, point.expense]));

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.row}>
        {data.map((point) => (
          <View key={`${point.year}-${point.month}`} style={styles.column}>
            <View style={styles.bars}>
              <View
                style={[
                  styles.bar,
                  styles.incomeBar,
                  { backgroundColor: theme.colors.success, height: `${(point.income / maxValue) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  styles.expenseBar,
                  { backgroundColor: theme.colors.danger, height: `${(point.expense / maxValue) * 100}%` },
                ]}
              />
            </View>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>{point.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.danger }]} />
          <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Expense</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bars: {
    height: 140,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 12,
    borderRadius: 999,
    minHeight: 6,
  },
  incomeBar: {},
  expenseBar: {},
  label: {
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    fontSize: 12,
  },
});
