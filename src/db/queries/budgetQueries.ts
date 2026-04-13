export const budgetQueries = {
  list: `
    SELECT
      b.*,
      c.name AS category_name,
      c.icon AS category_icon,
      c.color AS category_color,
      COALESCE(SUM(
        CASE
          WHEN t.type = 'expense'
          AND CAST(strftime('%m', t.transaction_date) AS INTEGER) = b.month
          AND CAST(strftime('%Y', t.transaction_date) AS INTEGER) = b.year
          THEN t.amount
          ELSE 0
        END
      ), 0) AS spent
    FROM budgets b
    INNER JOIN categories c ON c.id = b.category_id
    LEFT JOIN transactions t ON t.category_id = b.category_id
    WHERE b.month = ? AND b.year = ?
    GROUP BY b.id
    ORDER BY c.name ASC;
  `,
  byId: `SELECT * FROM budgets WHERE id = ?;`,
  byCategoryPeriod: `
    SELECT *
    FROM budgets
    WHERE category_id = ? AND month = ? AND year = ?;
  `,
  upsert: `
    INSERT INTO budgets (id, category_id, amount, month, year, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(category_id, month, year)
    DO UPDATE SET amount = excluded.amount, updated_at = excluded.updated_at;
  `,
  delete: `DELETE FROM budgets WHERE id = ?;`,
};
