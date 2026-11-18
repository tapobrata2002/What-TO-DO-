
import { getToday } from './dateHelpers';

export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const normalizeTasks = (tasks) => {
  if (!Array.isArray(tasks)) return [];

  return tasks
    .filter((task) => (
      task &&
      typeof task === 'object' &&
      typeof task.text === 'string' &&
      task.text.trim() !== ''
    ))
    .map((task) => {
      const oldPriority = {
        Low: 1,
        Medium: 3,
        High: 5
      };

      const oldImportance = Number.isInteger(task.importance)
        ? Math.min(5, Math.max(1, task.importance))
        : 0;

      const priorityLevel = Number.isInteger(task.priorityLevel)
        ? Math.min(5, Math.max(1, task.priorityLevel))
        : oldImportance > 0
          ? oldImportance
          : oldPriority[task.priority] || 3;

      return {
        id: task.id ?? createId(),
        text: task.text.trim(),
        date: typeof task.date === 'string' ? task.date : '',
        completed: task.completed === true,
        priorityLevel,
        pinned: task.pinned === true,
        createdAt: task.createdAt || null,
        completedAt: task.completedAt || null
      };
    });
};

export const isOverdue = (task) => (
  !task.completed &&
  Boolean(task.date) &&
  task.date < getToday()
);
