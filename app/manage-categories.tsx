import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { TextField } from '@/src/components/common/TextField';
import { categoryColorPresets } from '@/src/features/categories/utils';
import { useCategories } from '@/src/features/categories/hooks/useCategories';
import { useAppTheme } from '@/src/hooks/useAppTheme';

export default function ManageCategoriesScreen() {
  const theme = useAppTheme();
  const { categories, loading, error, saveCategory, deleteCategory } = useCategories();
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [icon, setIcon] = useState('pricetag-outline');
  const [color, setColor] = useState(categoryColorPresets[0]);

  const incomeCategories = categories.filter((category) => category.type === 'income');
  const expenseCategories = categories.filter((category) => category.type === 'expense');

  return (
    <ScreenContainer header={<SectionHeader title="Manage Categories" subtitle="Create custom income and expense groups" />}>
      <View style={[styles.formCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TextField label="Category name" value={name} onChangeText={setName} placeholder="Groceries" />
        <ChipSelector
          label="Type"
          options={[
            { label: 'Expense', value: 'expense' },
            { label: 'Income', value: 'income' },
          ]}
          value={type}
          onChange={setType}
        />
        <TextField label="Icon name" value={icon} onChangeText={setIcon} placeholder="restaurant-outline" />
        <ChipSelector
          label="Color"
          options={categoryColorPresets.map((preset) => ({ label: preset.replace('#', ''), value: preset }))}
          value={color}
          onChange={setColor}
        />
        <PrimaryButton
          label="Save Category"
          onPress={() => {
            void (async () => {
              try {
                await saveCategory({ name, type, icon, color });
                setName('');
                setIcon('pricetag-outline');
                setColor(categoryColorPresets[0]);
              } catch (saveError) {
                Alert.alert(
                  'Unable to save category',
                  saveError instanceof Error ? saveError.message : 'Try again.'
                );
              }
            })();
          }}
        />
      </View>

      {loading ? <Text style={[styles.message, { color: theme.colors.textMuted }]}>Loading categories...</Text> : null}
      {error ? <EmptyState title="Categories unavailable" description={error} /> : null}

      <SectionHeader title="Expense Categories" />
      {expenseCategories.map((category) => (
        <View
          key={category.id}
          style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{category.name}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{category.icon}</Text>
          </View>
          <PrimaryButton
            label="Delete"
            variant="ghost"
            onPress={() =>
              Alert.alert('Delete category?', `Remove "${category.name}"?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    void deleteCategory(category.id).catch((deleteError) => {
                      Alert.alert(
                        'Unable to delete category',
                        deleteError instanceof Error ? deleteError.message : 'Try again.'
                      );
                    });
                  },
                },
              ])
            }
          />
        </View>
      ))}

      <SectionHeader title="Income Categories" />
      {incomeCategories.map((category) => (
        <View
          key={category.id}
          style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{category.name}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{category.icon}</Text>
          </View>
          <PrimaryButton
            label="Delete"
            variant="ghost"
            onPress={() =>
              Alert.alert('Delete category?', `Remove "${category.name}"?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    void deleteCategory(category.id).catch((deleteError) => {
                      Alert.alert(
                        'Unable to delete category',
                        deleteError instanceof Error ? deleteError.message : 'Try again.'
                      );
                    });
                  },
                },
              ])
            }
          />
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  message: {
    fontSize: 14,
  },
  row: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
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
});
