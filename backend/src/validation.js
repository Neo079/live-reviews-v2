const MAX_TITLE = 200;
const MAX_CONTENT = 5000;

/**
 * Validates and normalises the editable review fields.
 * Returns { value } on success or { error } with a human readable message.
 */
export function validateReviewInput(body) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const content = typeof body?.content === 'string' ? body.content.trim() : '';

  if (!title) return { error: 'Title is required' };
  if (!content) return { error: 'Content is required' };
  if (title.length > MAX_TITLE) {
    return { error: `Title must be at most ${MAX_TITLE} characters` };
  }
  if (content.length > MAX_CONTENT) {
    return { error: `Content must be at most ${MAX_CONTENT} characters` };
  }
  return { value: { title, content } };
}

/** Validates a full review object, as sent by the undo/restore flow. */
export function validateRestoreInput(body) {
  const { value, error } = validateReviewInput(body);
  if (error) return { error };

  if (typeof body.id !== 'string' || !body.id) {
    return { error: 'id is required' };
  }
  if (
    typeof body.dateTime !== 'string' ||
    Number.isNaN(Date.parse(body.dateTime))
  ) {
    return { error: 'dateTime must be a valid ISO date string' };
  }
  return { value: { ...value, id: body.id, dateTime: body.dateTime } };
}
