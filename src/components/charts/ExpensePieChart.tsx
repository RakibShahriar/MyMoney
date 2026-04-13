import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import type { CategorySpendSlice } from '@/src/features/analytics/types';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useCurrencySettings } from '@/src/hooks/useCurrencySettings';
import { formatCurrency } from '@/src/utils/currency';

interface ExpensePieChartProps {
  data: CategorySpendSlice[];
}

export const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  const theme = useAppTheme();
  const currency = useCurrencySettings();
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.chartRow}>
        <View style={styles.chartWrap}>
          <Svg width={160} height={160} viewBox="0 0 160 160">
            <Circle cx="80" cy="80" r={radius} stroke={theme.colors.surfaceMuted} strokeWidth="18" fill="none" />
            {data.map((item) => {
              const portion = total === 0 ? 0 : item.total / total;
              const strokeDasharray = `${portion * circumference} ${circumference}`;
              const circle = (
                <Circle
                  key={item.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={-offset}
                  fill="none"
                  rotation="-90"
                  origin="80, 80"
                />
              );
              offset += portion * circumference;
              return circle;
            })}
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={[styles.centerValue, { color: theme.colors.text }]}>
              {formatCurrency(total, currency)}
            </Text>
            <Text style={[styles.centerCaption, { color: theme.colors.textMuted }]}>Spent</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {data.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <View style={styles.legendCopy}>
                <Text style={[styles.legendTitle, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.legendValue, { color: theme.colors.textMuted }]}>
                  {formatCurrency(item.total, currency)}
                </Text>
              </View>
            </View>
          ))}
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
  },
  chartRow: {
    gap: 16,
  },
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    gap: 2,
  },
  centerValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  centerCaption: {
    fontSize: 12,
  },
  legend: {
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendCopy: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 12,
  },
});
