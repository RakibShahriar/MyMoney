import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/hooks/useAppTheme';
import { getMonthLabel } from '@/src/utils/date';

interface PeriodNavigatorProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PeriodNavigator = ({
  month,
  year,
  onPrevious,
  onNext,
}: PeriodNavigatorProps) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Pressable onPress={onPrevious} style={styles.button}>
        <Text style={[styles.arrow, { color: theme.colors.primary }]}>{'<'}</Text>
      </Pressable>
      <Text style={[styles.label, { color: theme.colors.text }]}>{getMonthLabel(month, year)}</Text>
      <Pressable onPress={onNext} style={styles.button}>
        <Text style={[styles.arrow, { color: theme.colors.primary }]}>{'>'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
