export const transactionQueries = {
  listBase: `
    SELECT
      t.*,
      a.name AS account_name,
      a.icon AS account_icon,
      c.name AS category_name,
      c.icon AS category_icon,
      c.color AS category_color
    FROM transactions t
    INNER JOIN accounts a ON a.id = t.account_id
    INNER JOIN categories c ON c.id = t.category_id
  `,
  byId: `
    SELECT
      t.*,
      a.name AS account_name,
      a.icon AS account_icon,
      c.name AS category_name,
      c.icon AS category_icon,
      c.color AS category_color
    FROM transactions t
    INNER JOIN accounts a ON a.id = t.account_id
    INNER JOIN categories c ON c.id = t.category_id
    WHERE t.id = ?;
  `,
  insert: `
    INSERT INTO transactions (
      id, account_id, category_id, type, amount, note, transaction_date, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
  update: `
    UPDATE transactions
    SET account_id = ?, category_id = ?, type = ?, amount = ?, note = ?, transaction_date = ?, updated_at = ?
    WHERE id = ?;
  `,
  delete: `DELETE FROM transactions WHERE id = ?;`,
};
