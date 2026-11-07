
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

    // 1. Store tasks and load saved tasks
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('what-to-do-tasks');

        try {
            return savedTodos ? JSON.parse(savedTodos) : [];
        } catch {
            return [];
        }
    });

    // 2. Store input values
    const [input, setInput] = useState('');
    const [dueDate, setDueDate] = useState('');

    // 3. Save tasks whenever the task list changes
    useEffect(() => {
        localStorage.setItem(
            'what-to-do-tasks',
            JSON.stringify(todos)
        );
    }, [todos]);

    // 4. Add a new task
    const addTask = () => {
        if (input.trim() === '') return;

        const newTodo = {
            id: Date.now(),
            text: input.trim(),
            date: dueDate,
            completed: false,
            priority: 'Medium',
            category: 'Personal'
        };

        setTodos([...todos, newTodo]);
        setInput('');
        setDueDate('');
    };

    // 5. Delete a task
    const deleteTask = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // 6. Mark a task as completed or pending
    const toggleTask = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };

    // 7. Display application
    return (
        <main className="app-container">

            <header className="app-header">

                <img
                    src="/logo.svg"
                    alt="What To-Do calendar logo"
                    className="app-logo"
                />

                <div className="header-title">
                    <h1>WHAT TO-DO?</h1>
                </div>

                <div className="header-spacer" aria-hidden="true"></div>

                <p>Organize your day, one task at a time.</p>

            </header>

            <section className="todo-section">

                <div className="todo-form">

                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />

                    <button type="button" onClick={addTask}>
                        Add Task
                    </button>

                </div>

                <div className="todo-list">

                    <h2>Your Tasks ({todos.length})</h2>

                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>

                                <div>
                                    <span
                                        style={{
                                            textDecoration: todo.completed
                                                ? 'line-through'
                                                : 'none'
                                        }}
                                    >
                                        {todo.text}
                                    </span>

                                    <p>Due: {todo.date || 'Due Today'}</p>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => toggleTask(todo.id)}
                                    >
                                        {todo.completed ? 'Undo' : 'Complete'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteTask(todo.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>

                    {todos.length === 0 && (
                        <p>No tasks yet. Add your first task!</p>
                    )}

                </div>

            </section>



            <footer className="app-footer">
                <p>
                    © {new Date().getFullYear()} <strong>WHAT TO-DO?</strong>
                    <span> — Organize. Prioritize. Accomplish.</span>
                </p>

                <p className="footer-credit">
                    Made by <strong>Taborata Roy.</strong>
                </p>
            </footer>


        </main >
    );
}

export default App;
