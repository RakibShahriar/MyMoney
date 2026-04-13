import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

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
  const { settings, loading, error, saveSettings } = useSettings();
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const [lockEnabled, setLockEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setCurrencyCode(settings.currency_code);
      setDecimalPlaces(String(settings.decimal_places));
      setThemeMode(settings.theme_mode);
      setLockEnabled(settings.lock_enabled);
    }
  }, [settings]);

  const selectedCurrency = currencyOptions.find((option) => option.code === currencyCode) ?? currencyOptions[0];

  return (
    <ScreenContainer header={<SectionHeader title="Settings" subtitle="Personalize currency, theme, and local app behavior" />}>
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
        <ChipSelector
          label="App lock"
          options={[
            { label: 'Disabled', value: 'off' },
            { label: 'Enabled', value: 'on' },
          ]}
          value={lockEnabled ? 'on' : 'off'}
          onChange={(value) => setLockEnabled(value === 'on')}
        />
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
                lock_enabled: lockEnabled,
              });
              Alert.alert('Settings saved', 'Your preferences were updated locally on this device.');
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
        <PrimaryButton label="Manage Categories" variant="secondary" onPress={() => router.push('/manage-categories')} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <SectionHeader title="Backup & Restore" subtitle="Version 1 stays fully offline on the device" />
        <Text style={[styles.backupNote, { color: theme.colors.textMuted }]}>
          The database is already local-only. File export and import can be added later with Expo filesystem APIs.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
});
