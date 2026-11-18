
export const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (date) => {
  if (!date) return 'Due Today';

  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );
};

export const generateCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push({
      date: new Date(year, month, i - startingDay + 1),
      currentMonth: false
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true
    });
  }

  while (days.length < 42) {
    const nextDay = days.length - startingDay - daysInMonth + 1;

    days.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false
    });
  }

  return days;
};
