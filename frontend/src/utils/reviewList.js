const byNewestFirst = (a, b) => b.dateTime.localeCompare(a.dateTime);

/**
 * Applies a live event from the server to the list of reviews and
 * returns the new list, keeping it ordered newest first.
 */
export function applyEvent(reviews, { type, review }) {
  switch (type) {
    case 'created':
    case 'restored':
      return [review, ...reviews.filter((r) => r.id !== review.id)].sort(
        byNewestFirst,
      );
    case 'updated':
      return reviews.map((r) => (r.id === review.id ? review : r));
    case 'deleted':
      return reviews.filter((r) => r.id !== review.id);
    default:
      return reviews;
  }
}

/** Case-insensitive search over title and content. */
export function filterReviews(reviews, query) {
  const term = query.trim().toLowerCase();
  if (!term) return reviews;
  return reviews.filter(
    ({ title, content }) =>
      title.toLowerCase().includes(term) ||
      content.toLowerCase().includes(term),
  );
}

export const DEFAULT_SORT = { key: 'dateTime', direction: 'desc' };

// Direction used the first time a column is selected.
const INITIAL_DIRECTION = { title: 'asc', dateTime: 'desc' };

/** Returns the sort state after the user clicks the header of `key`. */
export function nextSort(current, key) {
  if (current.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
  }
  return { key, direction: INITIAL_DIRECTION[key] };
}

/** Returns a sorted copy by title or dateTime; ties fall back to newest first. */
export function sortReviews(reviews, { key, direction }) {
  const compare =
    key === 'title'
      ? (a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      : (a, b) => a.dateTime.localeCompare(b.dateTime);
  const sign = direction === 'asc' ? 1 : -1;

  return [...reviews].sort(
    (a, b) => sign * compare(a, b) || byNewestFirst(a, b),
  );
}

export const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString();
