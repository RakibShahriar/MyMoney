export const accountQueries = {
  list: `
    SELECT a.*,
      COALESCE(COUNT(t.id), 0) AS transaction_count
    FROM accounts a
    LEFT JOIN transactions t ON t.account_id = a.id
    GROUP BY a.id
    ORDER BY a.created_at ASC;
  `,
  byId: `
    SELECT a.*,
      COALESCE(COUNT(t.id), 0) AS transaction_count
    FROM accounts a
    LEFT JOIN transactions t ON t.account_id = a.id
    WHERE a.id = ?
    GROUP BY a.id;
  `,
  insert: `
    INSERT INTO accounts (
      id, name, type, initial_balance, current_balance, icon, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `,
  update: `
    UPDATE accounts
    SET name = ?, type = ?, initial_balance = ?, current_balance = ?, icon = ?, updated_at = ?
    WHERE id = ?;
  `,
  delete: `DELETE FROM accounts WHERE id = ?;`,
  updateBalance: `
    UPDATE accounts
    SET current_balance = current_balance + ?, updated_at = ?
    WHERE id = ?;
  `,
};
