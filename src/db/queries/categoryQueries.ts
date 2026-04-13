export const categoryQueries = {
  list: `
    SELECT *
    FROM categories
    ORDER BY type ASC, name ASC;
  `,
  byId: `SELECT * FROM categories WHERE id = ?;`,
  byType: `SELECT * FROM categories WHERE type = ? ORDER BY name ASC;`,
  insert: `
    INSERT INTO categories (id, name, type, icon, color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `,
  update: `
    UPDATE categories
    SET name = ?, type = ?, icon = ?, color = ?, updated_at = ?
    WHERE id = ?;
  `,
  delete: `DELETE FROM categories WHERE id = ?;`,
};
