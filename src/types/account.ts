import type { AccountType, BaseEntity } from '@/src/types/common';

export interface Account extends BaseEntity {
  name: string;
  type: AccountType;
  initial_balance: number;
  current_balance: number;
  icon: string;
}

export interface AccountInput {
  id?: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  icon: string;
}

export interface AccountSummary extends Account {
  transaction_count: number;
}
