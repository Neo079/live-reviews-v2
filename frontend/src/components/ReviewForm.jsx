import { useState } from 'react';

const EMPTY_REVIEW = { title: '', content: '' };

/**
 * Shared form for creating and editing a review. Passing `onDelete`
 * (edit mode) adds a Delete button. Reset restores the values the
 * form started with: empty when creating, saved values when editing.
 */
export default function ReviewForm({
  initialReview = EMPTY_REVIEW,
  onSave,
  onCancel,
  onDelete,
  error,
}) {
  const [title, setTitle] = useState(initialReview.title);
  const [content, setContent] = useState(initialReview.content);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ title, content });
  };

  const handleReset = () => {
    setTitle(initialReview.title);
    setContent(initialReview.content);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          type="text"
          value={title}
          maxLength={200}
          required
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label>
        Content
        <textarea
          value={content}
          rows={8}
          required
          onChange={(event) => setContent(event.target.value)}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button className="button button-primary" type="submit">
          Save
        </button>
        <button className="button" type="button" onClick={handleReset}>
          Reset
        </button>
        <button className="button" type="button" onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button
            className="button button-danger push-right"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
