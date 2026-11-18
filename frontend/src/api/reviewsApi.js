const BASE_URL = '/api/reviews';

async function request(path = '', options = {}) {
  const response = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body && JSON.stringify(options.body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error ?? 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const getReviews = () => request();
export const getReview = (id) => request(`/${id}`);
export const createReview = (review) =>
  request('', { method: 'POST', body: review });
export const updateReview = (id, review) =>
  request(`/${id}`, { method: 'PUT', body: review });
// Re-creates a deleted review with its original id and timestamp (undo).
export const restoreReview = (review) =>
  request('/restore', { method: 'POST', body: review });
export const deleteReview = (id) => request(`/${id}`, { method: 'DELETE' });
