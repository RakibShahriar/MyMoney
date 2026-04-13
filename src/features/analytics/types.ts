import type { AccountSummary } from '@/src/types/account';
import type { BudgetProgress } from '@/src/types/budget';
import type { TransactionListItem } from '@/src/types/transaction';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
}

export interface CategorySpendSlice {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

export interface CashFlowPoint {
  month: number;
  year: number;
  label: string;
  income: number;
  expense: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  expenseBreakdown: CategorySpendSlice[];
  cashFlow: CashFlowPoint[];
  budgets: BudgetProgress[];
  accounts: AccountSummary[];
  recentTransactions: TransactionListItem[];
}
