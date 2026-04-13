export const analyticsQueries = {
  summary: `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
    FROM transactions
    WHERE transaction_date BETWEEN ? AND ?
      AND (? IS NULL OR account_id = ?);
  `,
  expenseByCategory: `
    SELECT
      c.id,
      c.name,
      c.icon,
      c.color,
      COALESCE(SUM(t.amount), 0) AS total
    FROM categories c
    INNER JOIN transactions t ON t.category_id = c.id
    WHERE t.type = 'expense'
      AND t.transaction_date BETWEEN ? AND ?
      AND (? IS NULL OR t.account_id = ?)
    GROUP BY c.id
    HAVING total > 0
    ORDER BY total DESC;
  `,
  cashFlowByMonth: `
    SELECT
      CAST(strftime('%m', transaction_date) AS INTEGER) AS month,
      CAST(strftime('%Y', transaction_date) AS INTEGER) AS year,
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
    FROM transactions
    WHERE transaction_date BETWEEN ? AND ?
    GROUP BY year, month
    ORDER BY year ASC, month ASC;
  `,
};
