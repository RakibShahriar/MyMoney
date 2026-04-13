import { budgetRepository } from '@/src/features/budgets/repository/budgetRepository';
import type { BudgetInput } from '@/src/types/budget';
import { createId } from '@/src/utils/id';
import { budgetInputSchema } from '@/src/utils/validation';

export const budgetService = {
  async listBudgets(month: number, year: number) {
    return budgetRepository.listByMonth(month, year);
  },

  async getBudget(id: string) {
    return budgetRepository.findById(id);
  },

  async saveBudget(input: BudgetInput) {
    const validated = budgetInputSchema.parse(input);
    const id = validated.id ?? createId();
    await budgetRepository.upsert({ ...validated, id });
    return budgetRepository.findByCategoryPeriod(
      validated.category_id,
      validated.month,
      validated.year
    );
  },

  async deleteBudget(id: string) {
    await budgetRepository.delete(id);
  },
};
