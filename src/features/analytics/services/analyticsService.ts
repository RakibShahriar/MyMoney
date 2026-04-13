import { accountRepository } from '@/src/features/accounts/repository/accountRepository';
import { analyticsRepository } from '@/src/features/analytics/repository/analyticsRepository';
import type { DashboardData } from '@/src/features/analytics/types';
import { budgetRepository } from '@/src/features/budgets/repository/budgetRepository';
import { transactionRepository } from '@/src/features/transactions/repository/transactionRepository';

export const analyticsService = {
  async getDashboardData(month: number, year: number, accountId?: string): Promise<DashboardData> {
    const [summary, expenseBreakdown, cashFlow, budgets, accounts, recentTransactions] = await Promise.all([
      analyticsRepository.getSummary(month, year, accountId),
      analyticsRepository.getExpenseBreakdown(month, year, accountId),
      analyticsRepository.getCashFlow(accountId),
      budgetRepository.listByMonth(month, year),
      accountRepository.list(),
      transactionRepository.list({ month, year, accountId }),
    ]);

    return {
      summary,
      expenseBreakdown,
      cashFlow,
      budgets,
      accounts,
      recentTransactions: recentTransactions.slice(0, 5),
    };
  },
};
