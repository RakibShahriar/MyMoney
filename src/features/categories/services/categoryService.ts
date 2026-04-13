import { categoryRepository } from '@/src/features/categories/repository/categoryRepository';
import type { CategoryInput } from '@/src/types/category';
import type { TransactionType } from '@/src/types/common';
import { createId } from '@/src/utils/id';
import { categoryInputSchema } from '@/src/utils/validation';

export const categoryService = {
  async listCategories(type?: TransactionType) {
    return categoryRepository.list(type);
  },

  async saveCategory(input: CategoryInput) {
    const validated = categoryInputSchema.parse(input);

    if (validated.id) {
      await categoryRepository.update({ ...validated, id: validated.id });
      return categoryRepository.findById(validated.id);
    }

    const id = createId();
    await categoryRepository.create({ ...validated, id });
    return categoryRepository.findById(id);
  },

  async deleteCategory(categoryId: string) {
    const usageCount = await categoryRepository.countUsage(categoryId);

    if (usageCount > 0) {
      throw new Error('This category is already used by transactions or budgets.');
    }

    await categoryRepository.delete(categoryId);
  },
};
