import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createReview,
  deleteReview,
  getReview,
  updateReview,
} from '../api/reviewsApi.js';
import ReviewForm from '../components/ReviewForm.jsx';

/** Serves both /new (no id) and /:id (edit) with the same form. */
export default function ReviewFormPage({ onDeleted }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getReview(id)
      .then((data) => !cancelled && setReview(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goToList = () => navigate('/');

  const handleSave = async (values) => {
    setError(null);
    try {
      await (id ? updateReview(id, values) : createReview(values));
      goToList();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      onDeleted(await deleteReview(id));
      goToList();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="status">Loading...</p>;
  if (id && !review) {
    return (
      <section className="card card-narrow">
        <p className="error">{error ?? 'Review not found'}</p>
        <div className="page-header">
          <button className="button" type="button" onClick={goToList}>
            Back to list
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card card-narrow">
      <h2>{id ? 'Edit review' : 'New review'}</h2>
      <ReviewForm
        initialReview={review ?? undefined}
        onSave={handleSave}
        onCancel={goToList}
        onDelete={id ? handleDelete : undefined}
        error={error}
      />
    </section>
  );
}
