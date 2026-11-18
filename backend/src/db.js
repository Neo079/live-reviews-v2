import { DatabaseSync } from 'node:sqlite';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS reviews (
    id        TEXT PRIMARY KEY,
    title     TEXT NOT NULL,
    content   TEXT NOT NULL,
    date_time TEXT NOT NULL
  )
`;

const toReview = (row) =>
  row && {
    id: row.id,
    title: row.title,
    content: row.content,
    dateTime: row.date_time,
  };

/**
 * Opens (and initialises) the SQLite database and returns a small
 * store exposing the review operations the API needs.
 * Pass ':memory:' for an ephemeral database (used in tests).
 */
export function createReviewStore(file = 'reviews.db') {
  const db = new DatabaseSync(file);
  db.exec(SCHEMA);

  const selectAll = db.prepare('SELECT * FROM reviews ORDER BY date_time DESC');
  const selectOne = db.prepare('SELECT * FROM reviews WHERE id = ?');
  const insert = db.prepare(
    'INSERT INTO reviews (id, title, content, date_time) VALUES (?, ?, ?, ?)',
  );
  const update = db.prepare(
    'UPDATE reviews SET title = ?, content = ? WHERE id = ?',
  );
  const remove = db.prepare('DELETE FROM reviews WHERE id = ?');

  const get = (id) => toReview(selectOne.get(id));

  return {
    list: () => selectAll.all().map(toReview),
    get,
    create({ id, title, content, dateTime }) {
      insert.run(id, title, content, dateTime);
      return get(id);
    },
    update(id, { title, content }) {
      const { changes } = update.run(title, content, id);
      return changes ? get(id) : undefined;
    },
    delete(id) {
      const existing = get(id);
      if (existing) remove.run(id);
      return existing;
    },
    close: () => db.close(),
  };
}
