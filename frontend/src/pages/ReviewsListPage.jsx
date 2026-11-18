import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteReview } from '../api/reviewsApi.js';
import ReviewsTable from '../components/ReviewsTable.jsx';
import { useReviews } from '../hooks/useReviews.js';
import { filterReviews } from '../utils/reviewList.js';

export default function ReviewsListPage() {
  const { reviews, loading, error } = useReviews();
  const [deleteError, setDeleteError] = useState(null);
  const [query, setQuery] = useState('');

  const visibleReviews = useMemo(
    () => filterReviews(reviews, query),
    [reviews, query],
  );

  // The row disappears through the websocket "deleted" event.
  const handleDelete = (review) => {
    setDeleteError(null);
    deleteReview(review.id).catch((err) => setDeleteError(err.message));
  };

  return (
    <section>
      <div className="page-header">
        <div className="title-group">
          <h2>All reviews</h2>
          {!loading && <span className="badge">{visibleReviews.length}</span>}
        </div>
        <Link className="button button-primary" to="/new">
          New review
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by title or content"
          aria-label="Search reviews"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {deleteError && <p className="error">{deleteError}</p>}
      {loading && <p className="status">Loading...</p>}
      {!loading && reviews.length === 0 && (
        <p className="status">No reviews yet. Add the first one!</p>
      )}
      {reviews.length > 0 && visibleReviews.length === 0 && (
        <p className="status">No reviews match your search.</p>
      )}
      {visibleReviews.length > 0 && (
        <ReviewsTable reviews={visibleReviews} onDelete={handleDelete} />
      )}
    </section>
  );
}
