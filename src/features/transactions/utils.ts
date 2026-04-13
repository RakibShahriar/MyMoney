import type { SelectOption } from '@/src/types/common';

export const transactionTypeOptions: SelectOption<'all' | 'income' | 'expense'>[] = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];
