import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { useBootstrap } from '@/src/hooks/useBootstrap';
import { getNavigationTheme } from '@/src/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { ready, error, isDark, retry } = useBootstrap();

  if (!ready && !error) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#09121B' : '#F5F7FB' }]}>
        <ActivityIndicator size="large" color={isDark ? '#78C6A3' : '#147D80'} />
        <Text style={[styles.message, { color: isDark ? '#F7FAFC' : '#1D2A3A' }]}>Preparing your offline database...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#09121B' : '#F5F7FB' }]}>
        <Text style={[styles.errorTitle, { color: isDark ? '#F7FAFC' : '#1D2A3A' }]}>App failed to load</Text>
        <Text style={[styles.message, { color: isDark ? '#A7B9CB' : '#40536B' }]}>{error}</Text>
        <Pressable
          onPress={retry}
          style={[
            styles.retryButton,
            { backgroundColor: isDark ? '#18342F' : '#D9F1EF', borderColor: isDark ? '#4BC7AA' : '#147D80' },
          ]}>
          <Text style={[styles.retryText, { color: isDark ? '#F7FAFC' : '#102542' }]}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ThemeProvider value={getNavigationTheme(isDark)}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-transaction" options={{ presentation: 'modal', title: 'Add Transaction' }} />
        <Stack.Screen name="edit-transaction" options={{ presentation: 'modal', title: 'Edit Transaction' }} />
        <Stack.Screen name="create-budget" options={{ presentation: 'modal', title: 'Budget' }} />
        <Stack.Screen name="manage-categories" options={{ title: 'Manage Categories' }} />
        <Stack.Screen name="account-details" options={{ title: 'Account Details' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  retryButton: {
    marginTop: 8,
    minHeight: 46,
    minWidth: 140,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
