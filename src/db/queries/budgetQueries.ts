export const budgetQueries = {
  list: `
    SELECT
      b.*,
      c.name AS category_name,
      c.icon AS category_icon,
      c.color AS category_color,
      (
        SELECT COALESCE(SUM(t.amount), 0)
        FROM transactions t
        WHERE t.type = 'expense'
          AND CAST(strftime('%m', t.transaction_date) AS INTEGER) = b.month
          AND CAST(strftime('%Y', t.transaction_date) AS INTEGER) = b.year
          AND (t.category_id = b.category_id OR b.category_id = ?)
      ) AS spent
    FROM budgets b
    INNER JOIN categories c ON c.id = b.category_id
    WHERE b.month = ? AND b.year = ?
    ORDER BY CASE WHEN b.category_id = ? THEN 0 ELSE 1 END, c.name ASC;
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
