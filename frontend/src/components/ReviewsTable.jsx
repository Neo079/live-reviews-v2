import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/reviewList.js';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' };
const ARROW = { asc: '▲', desc: '▼' };

export default function ReviewsTable({
  reviews,
  highlights,
  sort,
  onSort,
  onDelete,
}) {
  const renderSortHeader = (key, label) => {
    const active = sort.key === key;
    return (
      <th aria-sort={active ? ARIA_SORT[sort.direction] : 'none'}>
        <button
          className={active ? 'sort-button sort-active' : 'sort-button'}
          type="button"
          onClick={() => onSort(key)}
        >
          {label}
          <span className="sort-arrow" aria-hidden="true">
            {active ? ARROW[sort.direction] : '↕'}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="reviews-table">
        <thead>
          <tr>
            <th>#</th>
            {renderSortHeader('title', 'Title')}
            <th>Content</th>
            {renderSortHeader('dateTime', 'Date-time')}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr
              key={review.id}
              className={
                highlights[review.id] ? `row-${highlights[review.id]}` : ''
              }
            >
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
                  disabled={highlights[review.id] === 'deleted'}
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
