import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { DATE_STORAGE_FORMAT } from '@/src/constants/app';
import { useAppTheme } from '@/src/hooks/useAppTheme';

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const buildCalendarDays = (monthCursor: dayjs.Dayjs) => {
  const startOfMonth = monthCursor.startOf('month');
  const startWeekday = startOfMonth.day();
  const daysInMonth = monthCursor.daysInMonth();

  return Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - startWeekday + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }

    return monthCursor.date(dayNumber);
  });
};

export const DateField = ({ label, value, onChange, hint }: DateFieldProps) => {
  const theme = useAppTheme();
  const parsedValue = dayjs(value, DATE_STORAGE_FORMAT, true);
  const selectedDate = parsedValue.isValid() ? parsedValue : dayjs();
  const [isOpen, setIsOpen] = useState(false);
  const [monthCursor, setMonthCursor] = useState(selectedDate.startOf('month'));

  const days = useMemo(() => buildCalendarDays(monthCursor), [monthCursor]);

  const open = () => {
    setMonthCursor(selectedDate.startOf('month'));
    setIsOpen(true);
  };

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Pressable
          onPress={open}
          style={[
            styles.fieldButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text style={[styles.fieldText, { color: theme.colors.text }]}>
            {selectedDate.format('DD MMM YYYY')}
          </Text>
          <Text style={[styles.calendarGlyph, { color: theme.colors.primary }]}>Calendar</Text>
        </Pressable>
        <Text style={[styles.helper, { color: theme.colors.textMuted }]}>
          {hint ?? selectedDate.format(DATE_STORAGE_FORMAT)}
        </Text>
      </View>

      <Modal animationType="fade" transparent visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)} />
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Choose date</Text>
              <Text style={[styles.modalSubtitle, { color: theme.colors.textMuted }]}>
                {selectedDate.format('DD MMM YYYY')}
              </Text>
            </View>

            <View style={styles.monthHeader}>
              <Pressable onPress={() => setMonthCursor((current) => current.subtract(1, 'month'))}>
                <Text style={[styles.monthArrow, { color: theme.colors.primary }]}>{'<'}</Text>
              </Pressable>
              <Text style={[styles.monthLabel, { color: theme.colors.text }]}>
                {monthCursor.format('MMMM YYYY')}
              </Text>
              <Pressable onPress={() => setMonthCursor((current) => current.add(1, 'month'))}>
                <Text style={[styles.monthArrow, { color: theme.colors.primary }]}>{'>'}</Text>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {weekdayLabels.map((weekday) => (
                <Text key={weekday} style={[styles.weekdayText, { color: theme.colors.textMuted }]}>
                  {weekday}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {days.map((day, index) => {
                if (!day) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                const formatted = day.format(DATE_STORAGE_FORMAT);
                const selected = formatted === selectedDate.format(DATE_STORAGE_FORMAT);
                const today = formatted === dayjs().format(DATE_STORAGE_FORMAT);

                return (
                  <Pressable
                    key={formatted}
                    onPress={() => {
                      onChange(formatted);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.dayCell,
                      styles.dayButton,
                      {
                        backgroundColor: selected ? theme.colors.primary : 'transparent',
                        borderColor: today ? theme.colors.primary : 'transparent',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: selected ? '#FFFFFF' : theme.colors.text,
                        },
                      ]}>
                      {day.date()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={() => {
                  onChange(dayjs().format(DATE_STORAGE_FORMAT));
                  setIsOpen(false);
                }}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors.border },
                ]}>
                <Text style={[styles.actionText, { color: theme.colors.primary }]}>Today</Text>
              </Pressable>
              <Pressable
                onPress={() => setIsOpen(false)}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border },
                ]}>
                <Text style={[styles.actionText, { color: theme.colors.text }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  fieldButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  fieldText: {
    fontSize: 15,
    fontWeight: '600',
  },
  calendarGlyph: {
    fontSize: 13,
    fontWeight: '700',
  },
  helper: {
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  modalHeader: {
    gap: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 13,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthArrow: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: '13.4%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    borderRadius: 999,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
