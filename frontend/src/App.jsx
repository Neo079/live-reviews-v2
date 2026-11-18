import { Link, Route, Routes } from 'react-router-dom';
import { restoreReview } from './api/reviewsApi.js';
import Snackbar from './components/Snackbar.jsx';
import { useSnackbar } from './hooks/useSnackbar.js';
import ReviewFormPage from './pages/ReviewFormPage.jsx';
import ReviewsListPage from './pages/ReviewsListPage.jsx';

export default function App() {
  const { snackbar, show, dismiss } = useSnackbar();

  const handleDeleted = (review) => show({ message: 'Review deleted', review });

  // Undo re-creates the review; the live list picks it up from the
  // websocket "restored" event, so nothing else needs updating here.
  const handleUndo = async () => {
    const { review } = snackbar;
    dismiss();
    try {
      await restoreReview(review);
      show({ message: 'Review restored' });
    } catch (err) {
      show({ message: `Could not undo: ${err.message}` });
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="container">
          <Link className="brand" to="/">
            Live Reviews
          </Link>
        </div>
      </header>

      <main className="container page">
        <Routes>
          <Route
            path="/"
            element={<ReviewsListPage onDeleted={handleDeleted} />}
          />
          <Route path="/new" element={<ReviewFormPage />} />
          <Route
            path="/:id"
            element={<ReviewFormPage onDeleted={handleDeleted} />}
          />
        </Routes>
      </main>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          onUndo={snackbar.review ? handleUndo : undefined}
        />
      )}
    </>
  );
}
