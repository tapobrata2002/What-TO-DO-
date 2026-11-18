
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'what-to-do-tasks';

// Generate unique task IDs
const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

// Normalize saved tasks and support older task formats
const normalizeTasks = (tasks) => {
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

export const useTodos = () => {

    // Load existing tasks from localStorage
    const [todos, setTodos] = useState(() => {
        try {
            const savedTodos = localStorage.getItem(STORAGE_KEY);

            if (!savedTodos) return [];

            return normalizeTasks(JSON.parse(savedTodos));
        } catch (error) {
            console.error('Could not read saved tasks:', error);
            return [];
        }
    });

    const [storageError, setStorageError] = useState(false);

    // Save tasks whenever the task list changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
            setStorageError(false);
        } catch (error) {
            console.error('Could not save tasks:', error);
            setStorageError(true);
        }
    }, [todos]);

    // Add a task
    const addTodo = ({ text, date, priorityLevel }) => {
        if (!text.trim()) return;

        const newTodo = {
            id: createId(),
            text: text.trim(),
            date,
            completed: false,
            priorityLevel,
            pinned: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        setTodos((previousTodos) => [
            ...previousTodos,
            newTodo
        ]);
    };

    // Edit an existing task
    const updateTodo = (id, updatedDetails) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === id
                    ? {
                        ...todo,
                        ...updatedDetails,
                        text: updatedDetails.text.trim()
                    }
                    : todo
            )
        );
    };

    // Complete or undo a task
    const toggleTodo = (id) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) => {
                if (todo.id !== id) return todo;

                const nextCompleted = !todo.completed;

                return {
                    ...todo,
                    completed: nextCompleted,
                    completedAt: nextCompleted
                        ? new Date().toISOString()
                        : null
                };
            })
        );
    };

    // Delete a task
    const deleteTodo = (id) => {
        setTodos((previousTodos) =>
            previousTodos.filter((todo) => todo.id !== id)
        );
    };

    // Pin or unpin a task
    const togglePin = (id) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === id
                    ? { ...todo, pinned: !todo.pinned }
                    : todo
            )
        );
    };

    return {
        todos,
        setTodos,
        storageError,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        togglePin
    };
};
