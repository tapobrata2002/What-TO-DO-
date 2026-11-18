
function PrioritySelector({
  priorityLevel = 3,
  onChange,
}) {
  const priorityDescriptions = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High',
    5: 'Very High',
  };

  return (
    <div className="priority-level-selector">
      <span className="priority-level-label">
        Priority: {priorityDescriptions[priorityLevel]}
      </span>

      <div className="priority-level-stars">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            className={level <= priorityLevel ? 'star-active' : ''}
            onClick={() => onChange(level)}
            aria-label={`Set priority to ${level}`}
            aria-pressed={priorityLevel === level}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default PrioritySelector;
