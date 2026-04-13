import type { AccountType, TransactionType } from '@/src/types/common';

export const titleCase = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const getTransactionTypeLabel = (type: TransactionType) =>
  type === 'income' ? 'Income' : 'Expense';

export const getAccountTypeLabel = (type: AccountType) => titleCase(type);
