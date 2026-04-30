import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { TextField } from '@/src/components/common/TextField';
import { currencyOptions } from '@/src/constants/currency';
import { useSettings } from '@/src/features/settings/hooks/useSettings';
import { themeModeOptions } from '@/src/features/settings/utils';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { settings, loading, error, saveSettings } = useSettings();
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const saveNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (settings) {
      setCurrencyCode(settings.currency_code);
      setDecimalPlaces(String(settings.decimal_places));
      setThemeMode(settings.theme_mode);
    }
  }, [settings]);

  useEffect(
    () => () => {
      if (saveNoticeTimerRef.current) {
        clearTimeout(saveNoticeTimerRef.current);
      }
    },
    []
  );

  const showSaveNotice = (message: string) => {
    setSaveNotice(message);

    if (saveNoticeTimerRef.current) {
      clearTimeout(saveNoticeTimerRef.current);
    }

    saveNoticeTimerRef.current = setTimeout(() => {
      setSaveNotice(null);
      saveNoticeTimerRef.current = null;
    }, 2200);
  };

  const selectedCurrency = currencyOptions.find((option) => option.code === currencyCode) ?? currencyOptions[0];

  return (
    <View style={styles.page}>
      <ScreenContainer
        swipeNavigation={{ previousHref: '/(tabs)/accounts' }}
        header={<SectionHeader title="Settings" subtitle="Personalize currency, theme, and local app behavior" />}>
        {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading settings...</Text> : null}
        {error ? <EmptyState title="Settings unavailable" description={error} /> : null}

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ChipSelector
            label="Currency"
            options={currencyOptions.map((option) => ({ label: option.code, value: option.code }))}
            value={currencyCode}
            onChange={setCurrencyCode}
          />
          <TextField
            label="Decimal places"
            value={decimalPlaces}
            onChangeText={setDecimalPlaces}
            keyboardType="number-pad"
          />
          <ChipSelector label="Theme" options={themeModeOptions} value={themeMode} onChange={setThemeMode} />
          <PrimaryButton
            label={saving ? 'Saving...' : 'Save Settings'}
            onPress={async () => {
              setSaving(true);
              try {
                await saveSettings({
                  currency_code: selectedCurrency.code,
                  currency_symbol: selectedCurrency.symbol,
                  decimal_places: Number(decimalPlaces),
                  theme_mode: themeMode,
                  lock_enabled: false,
                });
                showSaveNotice('Settings saved locally on this device.');
              } catch (saveError) {
                Alert.alert(
                  'Unable to save settings',
                  saveError instanceof Error ? saveError.message : 'Try again.'
                );
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <SectionHeader title="Categories" subtitle="Manage your income and expense groups" />
          <PrimaryButton
            label="Manage Categories"
            variant="secondary"
            onPress={() => router.push('/manage-categories')}
          />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <SectionHeader title="Backup & Restore" subtitle="Version 1 stays fully offline on the device" />
          <Text style={[styles.backupNote, { color: theme.colors.textMuted }]}>
            The database is already local-only. File export and import can be added later with Expo filesystem APIs.
          </Text>
        </View>
      </ScreenContainer>
      {saveNotice ? (
        <View pointerEvents="none" style={[styles.toastWrap, { bottom: insets.bottom + 74 }]}>
          <View style={[styles.toast, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
            <Text style={[styles.toastText, { color: '#FFFFFF' }]}>{saveNotice}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  message: {
    fontSize: 14,
  },
  backupNote: {
    fontSize: 14,
    lineHeight: 20,
  },
  toastWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  toast: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '100%',
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
