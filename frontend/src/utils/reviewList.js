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

export const formatDateTime =(isoString) =>
  new Date(isoString).toLocaleString();
