import type { BaseEntity, TransactionType } from '@/src/types/common';

export interface Category extends BaseEntity {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface CategoryInput {
  id?: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface DefaultCategorySeed {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}
