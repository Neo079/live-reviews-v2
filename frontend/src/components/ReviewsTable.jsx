import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/reviewList.js';

export default function ReviewsTable({ reviews, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="reviews-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Content</th>
            <th>Date-time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.id}>
              <td className="number-cell">{index + 1}</td>
              <td className="title-cell">{review.title}</td>
              <td>
                <div className="content-cell">{review.content}</div>
              </td>
              <td className="date-cell">{formatDateTime(review.dateTime)}</td>
              <td className="action-cell">
                <Link className="button button-small" to={`/${review.id}`}>
                  Edit
                </Link>
              </td>
              <td className="action-cell">
                <button
                  className="button button-small button-danger"
                  type="button"
                  onClick={() => onDelete(review)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
