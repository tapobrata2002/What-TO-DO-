
const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();

    return tasks.map((task) => ({
        ...task,
        id: task._id
    }));
};

export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    const task = await response.json();

    return {
        ...task,
        id: task._id
    };
};

export const updateTask = async (id, taskData) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    const task = await response.json();

    return {
        ...task,
        id: task._id
    };
};

export const removeTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return true;
};
