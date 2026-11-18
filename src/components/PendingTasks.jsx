
function PendingTasks({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <section className="pending-tasks-panel">
      <div className="pending-panel-heading">
        <h3>Pending Tasks</h3>

        <span className="pending-count">
          {tasks.length}
        </span>
      </div>

      {tasks.length > 0 ? (
        <ul className="pending-task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="pending-task-item"
            >
              <div className="pending-task-information">
                <span className="pending-task-name">
                  {task.text}
                </span>
              </div>

              <div className="pending-task-actions">
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  aria-label="Complete task"
                >
                  Complete
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  aria-label="Edit task"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  aria-label="Delete task"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-pending-tasks">
          No pending tasks. Great job!
        </p>
      )}
    </section>
  );
}

export default PendingTasks;
