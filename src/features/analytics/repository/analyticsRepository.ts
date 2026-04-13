import { DASHBOARD_MONTH_WINDOW } from '@/src/constants/app';
import { getDatabase } from '@/src/db/database';
import { analyticsQueries } from '@/src/db/queries/analyticsQueries';
import type {
  CashFlowPoint,
  CategorySpendSlice,
  DashboardSummary,
} from '@/src/features/analytics/types';
import { getRecentMonths, toSqlMonthBounds } from '@/src/utils/date';

export const analyticsRepository = {
  async getSummary(month: number, year: number, accountId?: string) {
    const db = await getDatabase();
    const bounds = toSqlMonthBounds(month, year);
    const row = (await db.getFirstAsync(analyticsQueries.summary, [
      bounds.start,
      bounds.end,
      accountId ?? null,
      accountId ?? null,
    ])) as Record<string, unknown> | null;

    const income = Number(row?.total_income ?? 0);
    const expense = Number(row?.total_expense ?? 0);

    const summary: DashboardSummary = {
      totalIncome: income,
      totalExpense: expense,
      netCashflow: income - expense,
    };

    return summary;
  },

  async getExpenseBreakdown(month: number, year: number, accountId?: string) {
    const db = await getDatabase();
    const bounds = toSqlMonthBounds(month, year);
    const rows = ((await db.getAllAsync(analyticsQueries.expenseByCategory, [
      bounds.start,
      bounds.end,
      accountId ?? null,
      accountId ?? null,
    ])) as Record<string, unknown>[]) ?? [];

    return rows.map(
      (row): CategorySpendSlice => ({
        id: String(row.id),
        name: String(row.name),
        icon: String(row.icon),
        color: String(row.color),
        total: Number(row.total ?? 0),
      })
    );
  },

  async getCashFlow(accountId?: string) {
    const db = await getDatabase();
    const periods = getRecentMonths(DASHBOARD_MONTH_WINDOW);
    const start = toSqlMonthBounds(periods[0].month, periods[0].year);
    const end = toSqlMonthBounds(periods[periods.length - 1].month, periods[periods.length - 1].year);
    const sql = analyticsQueries.cashFlowByMonth.replace(
      'WHERE transaction_date BETWEEN ? AND ?',
      'WHERE transaction_date BETWEEN ? AND ? AND (? IS NULL OR account_id = ?)'
    );
    const rows = ((await db.getAllAsync(sql, [
      start.start,
      end.end,
      accountId ?? null,
      accountId ?? null,
    ])) as Record<string, unknown>[]) ?? [];

    return periods.map((period): CashFlowPoint => {
      const match = rows.find(
        (row) => Number(row.month) === period.month && Number(row.year) === period.year
      );

      return {
        month: period.month,
        year: period.year,
        label: period.label,
        income: Number(match?.income ?? 0),
        expense: Number(match?.expense ?? 0),
      };
    });
  },
};
