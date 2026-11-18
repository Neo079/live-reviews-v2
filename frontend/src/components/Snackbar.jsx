/** Bottom notification with an optional Undo action. */
export default function Snackbar({ message, onUndo }) {
  return (
    <div className="snackbar" role="status">
      <span>{message}</span>
      {onUndo && (
        <button className="snackbar-action" type="button" onClick={onUndo}>
          Undo
        </button>
      )}
    </div>
  );
}
