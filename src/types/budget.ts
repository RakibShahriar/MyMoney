import type { BaseEntity } from '@/src/types/common';

export interface Budget extends BaseEntity {
  category_id: string;
  amount: number;
  month: number;
  year: number;
}

export interface BudgetInput {
  id?: string;
  category_id: string;
  amount: number;
  month: number;
  year: number;
}

export interface BudgetProgress extends Budget {
  category_name: string;
  category_icon: string;
  category_color: string;
  spent: number;
  remaining: number;
  progress: number;
}
