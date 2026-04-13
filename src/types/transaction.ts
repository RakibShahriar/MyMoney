import type { BaseEntity, TransactionType } from '@/src/types/common';

export interface Transaction extends BaseEntity {
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  note: string | null;
  transaction_date: string;
}

export interface TransactionListItem extends Transaction {
  account_name: string;
  account_icon: string;
  category_name: string;
  category_icon: string;
  category_color: string;
}

export interface TransactionInput {
  id?: string;
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  note?: string;
  transaction_date: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  month?: number;
  year?: number;
  type?: TransactionType | 'all';
  search?: string;
}
