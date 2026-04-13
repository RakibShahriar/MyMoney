export type TransactionType = 'income' | 'expense';

export type AccountType = 'cash' | 'bank' | 'wallet' | 'savings' | 'credit';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}
