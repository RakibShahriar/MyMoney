import type { TransactionType } from '@/src/types/common';

export const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

export const sumNumbers = (values: number[]) => values.reduce((sum, value) => sum + value, 0);

export const signedAmount = (amount: number, type: TransactionType) =>
  type === 'income' ? amount : -amount;

export const roundCurrency = (amount: number, decimals = 2) =>
  Number(amount.toFixed(decimals));

export const getBudgetProgress = (spent: number, amount: number) =>
  amount <= 0 ? 0 : clamp(spent / amount);
