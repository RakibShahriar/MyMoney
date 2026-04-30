import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ChipSelector } from '@/src/components/common/ChipSelector';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PrimaryButton } from '@/src/components/common/PrimaryButton';
import { ScreenContainer } from '@/src/components/common/ScreenContainer';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { TextField } from '@/src/components/common/TextField';
import { categoryColorPresets, categoryIconPresets } from '@/src/features/categories/utils';
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
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: theme.colors.text }]}>Icon</Text>
          <View style={styles.iconGrid}>
            {categoryIconPresets.map((preset) => {
              const selected = preset === icon;

              return (
                <Pressable
                  key={preset}
                  onPress={() => setIcon(preset)}
                  style={[
                    styles.iconOptionWrap,
                    {
                      backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surfaceMuted,
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}>
                  <Ionicons name={preset as never} size={20} color={selected ? theme.colors.primary : theme.colors.text} />
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.selectorBlock}>
          <Text style={[styles.selectorLabel, { color: theme.colors.text }]}>Color</Text>
          <View style={styles.colorRow}>
            {categoryColorPresets.map((preset) => {
              const selected = preset === color;

              return (
                <Pressable
                  key={preset}
                  onPress={() => setColor(preset)}
                  style={[
                    styles.colorOptionOuter,
                    {
                      borderColor: selected ? theme.colors.primary : theme.colors.border,
                      backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
                    },
                  ]}>
                  <View style={[styles.colorOptionInner, { backgroundColor: preset }]} />
                </Pressable>
              );
            })}
          </View>
        </View>
        <View
          style={[
            styles.previewCard,
            { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border },
          ]}>
          <View style={[styles.previewIconWrap, { backgroundColor: `${color}22` }]}>
            <Ionicons name={icon as never} size={20} color={color} />
          </View>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {name.trim() || 'Category preview'}
            </Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
              {type === 'income' ? 'Income category' : 'Expense category'}
            </Text>
          </View>
        </View>
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
          <View style={[styles.previewIconWrap, { backgroundColor: `${category.color}22` }]}>
            <Ionicons name={category.icon as never} size={18} color={category.color} />
          </View>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{category.name}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Expense category</Text>
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
          <View style={[styles.previewIconWrap, { backgroundColor: `${category.color}22` }]}>
            <Ionicons name={category.icon as never} size={18} color={category.color} />
          </View>
          <View style={styles.copy}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{category.name}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>Income category</Text>
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
  selectorBlock: {
    gap: 10,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconOptionWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOptionOuter: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionInner: {
    width: 22,
    height: 22,
    borderRadius: 999,
  },
  previewCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
