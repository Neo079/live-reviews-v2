import { Link, Route, Routes } from 'react-router-dom';
import ReviewFormPage from './pages/ReviewFormPage.jsx';
import ReviewsListPage from './pages/ReviewsListPage.jsx';

export default function App() {
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
          <Route path="/" element={<ReviewsListPage />} />
          <Route path="/new" element={<ReviewFormPage />} />
          <Route path="/:id" element={<ReviewFormPage />} />
        </Routes>
      </main>
    </>
  );
}
