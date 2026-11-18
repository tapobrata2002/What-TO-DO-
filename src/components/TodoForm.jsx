
function TodoForm({
  input,
  setInput,
  dueDate,
  setDueDate,
  priorityLevel,
  setPriorityLevel,
  editingTaskId,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      className="todo-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="What needs to be done?"
        aria-label="Task description"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        aria-label="Task due date"
      />

      <div className="priority-level-selector">
        <span className="priority-level-label">
          Priority
        </span>

        <div className="priority-level-stars">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              className={
                level <= priorityLevel
                  ? 'star-active'
                  : ''
              }
              onClick={() => setPriorityLevel(level)}
              aria-label={`Set priority to ${level}`}
              aria-pressed={priorityLevel === level}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <button type="submit">
        {editingTaskId ? 'Save Changes' : 'Add Task'}
      </button>

      {editingTaskId && (
        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default TodoForm;
