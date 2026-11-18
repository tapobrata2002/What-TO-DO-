
function TodoItem({
  todo,
  onToggle,
  onEdit,
  onPin,
  onDelete,
  renderTaskStars,
  isOverdue,
  formatDisplayDate,
}) {
  return (
    <li
      className={[
        todo.pinned ? 'pinned-task' : '',
        todo.completed ? 'task-completed' : '',
        isOverdue(todo) ? 'overdue-task' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="task-information">
        <div className="task-details">
          <span className="task-name">
            {todo.text}
          </span>

          <div className="task-meta">
            <span>
              {todo.date
                ? formatDisplayDate(todo.date)
                : 'Due Today'}
            </span>

            <span className="task-importance-stars">
              {renderTaskStars(todo.priorityLevel)}
            </span>

            {isOverdue(todo) && !todo.completed && (
              <span className="overdue-badge">
                Overdue
              </span>
            )}

            {todo.pinned && (
              <span className="pinned-badge">
                Pinned
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="home-task-actions">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {todo.completed ? 'Undo' : 'Complete'}
        </button>

        <button
          type="button"
          onClick={() => onEdit(todo)}
          aria-label="Edit task"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onPin(todo.id)}
          aria-label={todo.pinned ? 'Unpin task' : 'Pin task'}
        >
          {todo.pinned ? 'Unpin' : 'Pin'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
