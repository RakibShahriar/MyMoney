import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { categoryService } from '@/src/features/categories/services/categoryService';
import { useAppStore } from '@/src/store/appStore';
import type { Category, CategoryInput } from '@/src/types/category';
import type { TransactionType } from '@/src/types/common';

export const useCategories = (type?: TransactionType) => {
  const dataVersion = useAppStore((state) => state.dataVersion);
  const touchData = useAppStore((state) => state.touchData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCategories(await categoryService.listCategories(type));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    void load();
  }, [dataVersion, load]);

  const saveCategory = useCallback(
    async (input: CategoryInput) => {
      const result = await categoryService.saveCategory(input);
      touchData();
      await load();
      return result;
    },
    [load, touchData]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await categoryService.deleteCategory(categoryId);
      touchData();
      await load();
    },
    [load, touchData]
  );

  return { categories, loading, error, refresh: load, saveCategory, deleteCategory };
};
