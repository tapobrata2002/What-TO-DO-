
function Calendar({
  monthTitle,
  calendarDays,
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
  hasTasks,
}) {
  const weekdays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  return (
    <section className="monthly-calendar-card">
      <div className="dashboard-calendar-header">
        <h3>{monthTitle}</h3>

        <div className="month-navigation">
          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="dashboard-weekdays">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="dashboard-calendar-grid">
        {calendarDays.map((day) => {
          const dateString = day.date;
          const isSelected = dateString === selectedDate;
          const containsTasks = hasTasks(dateString);

          return (
            <button
              key={dateString}
              type="button"
              className={[
                'dashboard-calendar-day',
                day.isToday ? 'today' : '',
                isSelected ? 'selected' : '',
                containsTasks ? 'has-task' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(dateString)}
            >
              {day.day}

              {containsTasks && (
                <span className="task-indicator"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span className="legend-today">Today</span>
        <span className="legend-task">Tasks scheduled</span>
      </div>
    </section>
  );
}

export default Calendar;
