import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteReview } from '../api/reviewsApi.js';
import ReviewsTable from '../components/ReviewsTable.jsx';
import { useReviews } from '../hooks/useReviews.js';

export default function ReviewsListPage() {
  const { reviews, loading, error } = useReviews();
  const [deleteError, setDeleteError] = useState(null);

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
          {!loading && <span className="badge">{reviews.length}</span>}
        </div>
        <Link className="button button-primary" to="/new">
          New review
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {deleteError && <p className="error">{deleteError}</p>}
      {loading && <p className="status">Loading...</p>}
      {!loading && reviews.length === 0 && (
        <p className="status">No reviews yet. Add the first one!</p>
      )}
      {reviews.length > 0 && (
        <ReviewsTable reviews={reviews} onDelete={handleDelete} />
      )}
    </section>
  );
}
