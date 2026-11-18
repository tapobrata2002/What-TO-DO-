
import TodoItem from './TodoItem';

function TodoList({
  todos,
  onToggle,
  onEdit,
  onPin,
  onDelete,
  renderTaskStars,
  isOverdue,
  formatDisplayDate,
}) {
  return (
    <section className="todo-list">
      <h2>Your Tasks</h2>

      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onPin={onPin}
              onDelete={onDelete}
              renderTaskStars={renderTaskStars}
              isOverdue={isOverdue}
              formatDisplayDate={formatDisplayDate}
            />
          ))}
        </ul>
      ) : (
        <p className="empty-task-message">
          No tasks found. Add a task to get started!
        </p>
      )}
    </section>
  );
}

export default TodoList;
