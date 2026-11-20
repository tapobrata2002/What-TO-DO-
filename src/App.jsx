import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import TaskSearch from './components/TaskSearch';
import {
    getToday,
    formatDate,
    formatDisplayDate,
    generateCalendarDays
} from './utils/dateHelpers';
import {
    createId,
    normalizeTasks,
    isOverdue
} from './utils/taskHelpers';
import {
    drawProductivityCard as drawProductivityCardToCanvas
} from './utils/reportCanvas';
const STORAGE_KEY = 'what-to-do-tasks';
function App() {
    const today = getToday();
    // =========================================*
    // TASK STORAGE*
    // =========================================*
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
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
            setStorageError(false);
        } catch (error) {
            console.error('Could not save tasks:', error);
            setStorageError(true);
        }
    }, [todos]);
    // =========================================*
    // TASK FORM STATES*
    // =========================================*
    const [input, setInput] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priorityLevel, setPriorityLevel] = useState(3);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const resetTaskForm = () => {
        setInput('');
        setDueDate('');
        setPriorityLevel(3);
        setEditingTaskId(null);
    };
    // =========================================*
    // NAVIGATION AND PANEL STATES*
    // =========================================*
    const [activeView, setActiveView] = useState('tasks');
    const [showPendingTasks, setShowPendingTasks] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showSearchTools, setShowSearchTools] = useState(false);
    // =========================================*
    // SEARCH, FILTER AND SORT STATES*
    // =========================================*
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    // =========================================*
    // CALENDAR STATES*
    // =========================================*
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState(today);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [pickerMonth, setPickerMonth] = useState(() => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    // =========================================*
    // PRODUCTIVITY REPORT STATES*
    // =========================================*
    const [exportPeriod, setExportPeriod] = useState('weekly');
    const [reportDate, setReportDate] = useState(() => new Date());
    const reportCanvasRef = useRef(null);
    // =========================================*
    // TASK CREATION*
    // =========================================*
    const addTask = (date = dueDate) => {
        if (!input.trim()) return;
        const newTodo = {
            id: createId(),
            text: input.trim(),
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
        resetTaskForm();
        setCalendarOpen(false);
    };
    // =========================================*
    // TASK EDITING*
    // =========================================*
    const startEditingTask = (todo) => {
        setEditingTaskId(todo.id);
        setInput(todo.text);
        setDueDate(todo.date || '');
        setPriorityLevel(todo.priorityLevel || 3);
        setActiveView('tasks');
        setCalendarOpen(false);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const saveEditedTask = () => {
        if (!input.trim() || editingTaskId === null) return;
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === editingTaskId
                    ? {
                        ...todo,
                        text: input.trim(),
                        date: dueDate,
                        priorityLevel
                    }
                    : todo
            )
        );
        resetTaskForm();
    };
    const handleTaskSubmit = (date = dueDate) => {
        if (editingTaskId !== null) {
            saveEditedTask();
        } else {
            addTask(date);
        }
    };
    // =========================================*
    // TASK COMPLETION*
    // =========================================*
    const toggleTask = (id) => {
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
    // =========================================*
    // TASK DELETION*
    // =========================================*
    const deleteTask = (id) => {
        setTodos((previousTodos) =>
            previousTodos.filter((todo) => todo.id !== id)
        );
        if (editingTaskId === id) {
            resetTaskForm();
        }
    };
    // =========================================*
    // TASK PINNING*
    // =========================================*
    const togglePin = (id) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === id
                    ? { ...todo, pinned: !todo.pinned }
                    : todo
            )
        );
    };
    // =========================================*
    // PRIORITY SELECTOR*
    // =========================================*
    const renderPrioritySelector = () => (
        <div className="priority-level-selector">
            <span className="priority-level-label">
                PRIORITY LEVELS
            </span>
            <div
                className="priority-level-stars"
                role="group"
                aria-label="Choose task priority"
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => setPriorityLevel(star)}
                        aria-label={`Set priority to ${star} stars`}
                        aria-pressed={priorityLevel === star}
                        className={star <= priorityLevel ? 'star-active' : ''}
                    >
                        ★
                    </button>
                ))}
            </div>
            <span className="priority-level-description">
                {priorityLevel} out of 5 stars
            </span>
        </div>
    );
    const renderTaskStars = (rating = 3) => {
        const safeRating = Math.min(5, Math.max(1, rating));
        return (
            <span
                className="task-importance-stars"
                aria-label={`${safeRating} out of 5 priority stars`}
            >
                {'★'.repeat(safeRating)}
                {'☆'.repeat(5 - safeRating)}
            </span>
        );
    };
    // =========================================*
    // CALENDAR FUNCTIONS*
    // =========================================*
    const calendarDays = generateCalendarDays(visibleMonth);
    const pickerCalendarDays = generateCalendarDays(pickerMonth);
    const changeMonth = (direction) => {
        setVisibleMonth((previousMonth) =>
            new Date(
                previousMonth.getFullYear(),
                previousMonth.getMonth() + direction,
                1
            )
        );
    };
    const changePickerMonth = (direction) => {
        setPickerMonth((previousMonth) =>
            new Date(
                previousMonth.getFullYear(),
                previousMonth.getMonth() + direction,
                1
            )
        );
    };
    const selectDate = (date) => {
        setSelectedDate(formatDate(date));
        setVisibleMonth(
            new Date(date.getFullYear(), date.getMonth(), 1)
        );
    };
    const selectDueDate = (date) => {
        setDueDate(formatDate(date));
        setPickerMonth(
            new Date(date.getFullYear(), date.getMonth(), 1)
        );
        setCalendarOpen(false);
    };
    // =========================================*
    // TASK STATISTICS*
    // =========================================*
    const totalTasks = todos.length;
    const completedTasks = todos.filter(
        (todo) => todo.completed
    ).length;
    const pendingTaskList = todos.filter(
        (todo) => !todo.completed
    );
    const pendingTasks = pendingTaskList.length;
    const overdueTasks = pendingTaskList.filter(isOverdue);
    const getTasksForDate = (date) => {
        return todos.filter((todo) => {
            if (!todo.date) return date === today;
            return todo.date === date;
        });
    };
    const selectedDateTasks = getTasksForDate(selectedDate);
    const hasTasks = (dateString) => (
        getTasksForDate(dateString).length > 0
    );
    // =========================================*
    // SEARCH, FILTERING AND SORTING*
    // =========================================*
    const filteredTasks = useMemo(() => {
        let result = [...todos];
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((todo) =>
                todo.text.toLowerCase().includes(query)
            );
        }
        if (statusFilter === 'completed') {
            result = result.filter((todo) => todo.completed);
        } else if (statusFilter === 'pending') {
            result = result.filter((todo) => !todo.completed);
        } else if (statusFilter === 'overdue') {
            result = result.filter(isOverdue);
        }
        if (priorityFilter !== 'all') {
            result = result.filter(
                (todo) => todo.priorityLevel === Number(priorityFilter)
            );
        }
        result.sort((a, b) => {
            if (a.pinned !== b.pinned) {
                return a.pinned ? -1 : 1;
            }
            switch (sortBy) {
                case 'due-date':
                    return (a.date || '9999-12-31')
                        .localeCompare(b.date || '9999-12-31');
                case 'priority':
                    return (b.priorityLevel || 0) -
                        (a.priorityLevel || 0);
                case 'created':
                    return new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0);
                default:
                    return 0;
            }
        });
        return result;
    }, [
        todos,
        searchQuery,
        statusFilter,
        priorityFilter,
        sortBy
    ]);
    const clearSearchFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPriorityFilter('all');
        setSortBy('default');
    };
    const hasActiveSearchFilters = (
        searchQuery !== '' ||
        statusFilter !== 'all' ||
        priorityFilter !== 'all' ||
        sortBy !== 'default'
    );
    // =========================================*
    // =========================================
    // PRODUCTIVITY REPORT DATE RANGE
    // =========================================
    const getReportDateRange = () => {
        const year = reportDate.getFullYear();
        const month = reportDate.getMonth();
        if (exportPeriod === 'daily') {
            const start = new Date(reportDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(reportDate);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        }
        if (exportPeriod === 'weekly') {
            const start = new Date(reportDate);
            const day = start.getDay();
            const difference = day === 0 ? -6 : 1 - day;
            start.setDate(start.getDate() + difference);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return { start, end };
        }
        return {
            start: new Date(year, month, 1),
            end: new Date(year, month + 1, 0)
        };
    };
    const { start, end } = getReportDateRange();
    const reportStartDate = formatDate(start);
    const reportEndDate = formatDate(end);
    const reportTasks = todos.filter((task) => {
        const taskDate = task.date || today;
        return taskDate >= reportStartDate && taskDate <= reportEndDate;
    });
    const reportCompletedTasks = reportTasks.filter((task) => task.completed);
    const reportPendingTasks = reportTasks.filter((task) => !task.completed);
    const reportCompletionRate = reportTasks.length > 0
        ? Math.round((reportCompletedTasks.length / reportTasks.length) * 100)
        : 0;
    const reportPeriodTitle = (() => {
        if (exportPeriod === 'daily') {
            return reportDate.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
        }
        if (exportPeriod === 'weekly') {
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return reportDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    })();
    const changeReportPeriod = (direction) => {
        setReportDate((previousDate) => {
            const nextDate = new Date(previousDate);
            if (exportPeriod === 'daily') {
                nextDate.setDate(nextDate.getDate() + direction);
                return nextDate;
            }
            if (exportPeriod === 'weekly') {
                nextDate.setDate(nextDate.getDate() + direction * 7);
                return nextDate;
            }
            return new Date(previousDate.getFullYear(), previousDate.getMonth() + direction, 1);
        });
    };
    const changeExportPeriod = (period) => {
        setExportPeriod(period);
        setReportDate(new Date());
    };
    // PRODUCTIVITY CANVAS*
    // =========================================*
    const drawProductivityCard = () => {
        drawProductivityCardToCanvas({
            canvas: reportCanvasRef.current,
            exportPeriod,
            reportPeriodTitle,
            reportCompletionRate,
            reportTasks,
            reportCompletedTasks,
            reportPendingTasks
        });
    };
    useEffect(() => {
        if (showExport) {
            drawProductivityCard();
        }
    }, [
        showExport,
        exportPeriod,
        reportDate,
        todos,
        reportCompletionRate,
        reportPendingTasks.length,
        reportCompletedTasks.length
    ]);
    // =========================================*
    // DOWNLOAD PRODUCTIVITY REPORT*
    // =========================================*
    const downloadProductivityCard = () => {
        drawProductivityCard();
        const canvas = reportCanvasRef.current;
        if (!canvas) return;
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `what-to-do-${exportPeriod}-productivity.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    };
    // =========================================*
    // VIEW NAVIGATION*
    // =========================================*
    const openDashboard = () => {
        setActiveView('dashboard');
        setCalendarOpen(false);
        setShowSearchTools(false);
    };
    const openTasks = () => {
        setActiveView('tasks');
        setShowExport(false);
    };
    // =========================================*
    // TASK FORM*
    // =========================================*
    const renderTaskForm = (dateForNewTask = dueDate) => (
        <>
            <input
                type="text"
                placeholder="Add a new task..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleTaskSubmit(dateForNewTask);
                    }
                }}
                aria-label="Task name"
            />
            {renderPrioritySelector()}
            <button
                type="button"
                onClick={() => handleTaskSubmit(dateForNewTask)}
                disabled={!input.trim()}
            >
                {editingTaskId !== null ? 'Save Changes' : 'Add Task'}
            </button>
            {editingTaskId !== null && (
                <button
                    type="button"
                    onClick={resetTaskForm}
                >
                    Cancel Editing
                </button>
            )}
        </>
    );
    // =========================================*
    // TASK CARD ACTIONS*
    // =========================================*
    const renderTaskActions = (todo) => (
        <div className="home-task-actions">
            <button
                type="button"
                onClick={() => toggleTask(todo.id)}
            >
                {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button
                type="button"
                onClick={() => startEditingTask(todo)}
            >
                Edit
            </button>
            <button
                type="button"
                onClick={() => togglePin(todo.id)}
            >
                {todo.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button
                type="button"
                onClick={() => deleteTask(todo.id)}
            >
                Delete
            </button>
        </div>
    );
    const renderTaskDetails = (todo) => (
        <>
            <span className={`task-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
            </span>
            <p>
                Due: {formatDisplayDate(todo.date)}
                {' · '}
                Priority Level
            </p>
            {renderTaskStars(todo.priorityLevel)}
            {isOverdue(todo) && (
                <span className="overdue-label">OVERDUE</span>
            )}
            {todo.pinned && (
                <span className="pinned-label">📌 PINNED</span>
            )}
        </>
    );
    // =========================================*
    // MAIN UI*
    // =========================================*
    return (
        <main className="app-container">
            {/* HEADER */}
            <header className="app-header">
                <img
                    src="/logo.svg"
                    alt="What To-Do calendar logo"
                    className="app-logo"
                />
                <div className="header-title">
                    <h1>WHAT TO-DO?</h1>
                </div>
                <div className="header-spacer"></div>
                <p>Organize your day, one task at a time.</p>
            </header>
            {storageError && (
                <div className="storage-error" role="alert">
                    Warning: Your tasks could not be saved. Your browser
                    storage may be full or unavailable. Please back up
                    your tasks before closing the page.
                </div>
            )}
            {/* NAVIGATION */}
            <div className="view-navigation">
                {activeView === 'tasks' ? (
                    <button
                        type="button"
                        className="dashboard-toggle-button"
                        onClick={openDashboard}
                    >
                        <span>▦</span>
                        Productivity Dashboard
                        <span>→</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="back-to-tasks-button"
                        onClick={openTasks}
                    >
                        <span>←</span>
                        Back to My Tasks
                    </button>
                )}
            </div>
            {/* MAIN TASK PAGE */}
            {activeView === 'tasks' && (
                <section className="todo-section">
                    <div className="todo-form">
                        {renderTaskForm()}
                        {/* CUSTOM DATE PICKER */}
                        <div className="date-picker-container">
                            <button
                                type="button"
                                className="date-picker-trigger"
                                onClick={() => setCalendarOpen(!calendarOpen)}
                                aria-expanded={calendarOpen}
                            >
                                <span>📅</span>
                                <span>{formatDisplayDate(dueDate)}</span>
                                <span className="calendar-arrow">▼</span>
                            </button>
                            {calendarOpen && (
                                <div className="custom-calendar">
                                    <div className="calendar-header">
                                        <button
                                            type="button"
                                            className="calendar-nav-button"
                                            onClick={() => changePickerMonth(-1)}
                                            aria-label="Previous month"
                                        >
                                            ‹
                                        </button>
                                        <h3>
                                            {pickerMonth.toLocaleDateString(
                                                'en-US',
                                                {
                                                    month: 'long',
                                                    year: 'numeric'
                                                }
                                            )}
                                        </h3>
                                        <button
                                            type="button"
                                            className="calendar-nav-button"
                                            onClick={() => changePickerMonth(1)}
                                            aria-label="Next month"
                                        >
                                            ›
                                        </button>
                                    </div>
                                    <div className="calendar-weekdays">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                                            (day) => (
                                                <span key={day}>{day}</span>
                                            )
                                        )}
                                    </div>
                                    <div className="calendar-days">
                                        {pickerCalendarDays.map((item) => {
                                            const dateString = formatDate(item.date);
                                            const dayHasTasks = hasTasks(dateString);
                                            return (
                                                <button
                                                    type="button"
                                                    key={dateString}
                                                    className={[
                                                        'calendar-day',
                                                        !item.currentMonth && 'outside-month',
                                                        dateString === today && 'today',
                                                        dateString === dueDate && 'selected',
                                                        dayHasTasks && 'has-task'
                                                    ].filter(Boolean).join(' ')}
                                                    onClick={() => selectDueDate(item.date)}
                                                >
                                                    {item.date.getDate()}
                                                    {dayHasTasks && (
                                                        <span className="task-indicator"></span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="calendar-footer">
                                        <button
                                            type="button"
                                            onClick={() => selectDueDate(new Date())}
                                        >
                                            Today
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDueDate('');
                                                setCalendarOpen(false);
                                            }}
                                        >
                                            Clear date
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* SEARCH AND MANAGE TASKS */}
                    <div className="search-tools-launcher">
                        <div>
                            <span className="section-label">
                                TASK MANAGEMENT
                            </span>
                            <h3>Search & Manage Tasks</h3>
                            <p>
                                Find tasks, filter your list and change the order.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="search-tools-toggle-button"
                            onClick={() => setShowSearchTools(!showSearchTools)}
                            aria-expanded={showSearchTools}
                        >
                            {showSearchTools
                                ? 'Close Search Tools ↑'
                                : 'Open Search Tools ↓'}
                        </button>
                    </div>
                    {/* SEARCH AND FILTER PANEL */}
                    {showSearchTools && (
                        <TaskSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            priorityFilter={priorityFilter}
                            setPriorityFilter={setPriorityFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            onClearFilters={clearSearchFilters}
                            hasActiveSearchFilters={hasActiveSearchFilters}
                            resultCount={filteredTasks.length}
                        />
                    )}
                    {/* ALL TASKS */}
                    <div className="todo-list">
                        <h2>Your Tasks ({filteredTasks.length})</h2>
                        {filteredTasks.length > 0 ? (
                            <ul>
                                {filteredTasks.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className={[
                                            todo.pinned && 'pinned-task',
                                            todo.completed && 'task-completed',
                                            isOverdue(todo) && 'overdue-task'
                                        ].filter(Boolean).join(' ')}
                                    >
                                        <div>
                                            {renderTaskDetails(todo)}
                                        </div>
                                        {renderTaskActions(todo)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                {todos.length === 0
                                    ? 'No tasks yet. Add your first task!'
                                    : 'No tasks match your search or filters.'}
                            </p>
                        )}
                    </div>
                </section>
            )}
            {/* PRODUCTIVITY DASHBOARD */}
            {activeView === 'dashboard' && (
                <section className="dashboard-section">
                    <div className="dashboard-heading">
                        <h2>Your Productivity Dashboard</h2>
                        <p>Plan your month. Stay on track.</p>
                    </div>
                    {/* PRODUCTIVITY EXPORT LAUNCHER */}
                    <div className="productivity-export-launcher">
                        <div>
                            <span className="section-label">
                                YOUR PROGRESS, YOUR WAY
                            </span>
                            <h3>Share your productivity</h3>
                            <p>
                                Turn your completed and pending tasks into a report.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="productivity-export-launcher-button"
                            onClick={() => {
                                setReportDate(new Date());
                                setShowExport(!showExport);
                            }}
                        >
                            {showExport
                                ? 'Close Report ↑'
                                : 'Download Your Productivity ↓'}
                        </button>
                    </div>
                    {/* PRODUCTIVITY REPORT */}
                    {showExport && (
                        <section className="productivity-export-section">
                            <div className="productivity-export-heading">
                                <div>
                                    <span className="section-label">
                                        PRODUCTIVITY REPORT
                                    </span>
                                    <h2>Create Your Report</h2>
                                    <p>
                                        Choose a period and download your productivity card.
                                    </p>
                                </div>
                            </div>
                            <div className="export-period-selector">
                                <button type="button" className={exportPeriod === 'daily' ? 'active' : ''} onClick={() => changeExportPeriod('daily')}>
                                    Daily Report
                                </button>
                                <button type="button" className={exportPeriod === 'weekly' ? 'active' : ''} onClick={() => changeExportPeriod('weekly')}>
                                    Weekly Report
                                </button>
                                <button type="button" className={exportPeriod === 'monthly' ? 'active' : ''} onClick={() => changeExportPeriod('monthly')}>
                                    Monthly Report
                                </button>
                            </div>
                            <div className="export-period-navigation">
                                <button
                                    type="button"
                                    onClick={() => changeReportPeriod(-1)}
                                    aria-label="Previous report period"
                                >
                                    ‹
                                </button>
                                <div>
                                    <span className="section-label">
                                        SELECTED PERIOD
                                    </span>
                                    <h3>{reportPeriodTitle}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => changeReportPeriod(1)}
                                    aria-label="Next report period"
                                >
                                    ›
                                </button>
                            </div>
                            <div className="export-summary-grid">
                                <div className="export-summary-card">
                                    <span>TOTAL TASKS</span>
                                    <strong>{reportTasks.length}</strong>
                                </div>
                                <div className="export-summary-card">
                                    <span>COMPLETED</span>
                                    <strong>{reportCompletedTasks.length}</strong>
                                </div>
                                <div className="export-summary-card">
                                    <span>PENDING</span>
                                    <strong>{reportPendingTasks.length}</strong>
                                </div>
                                <div className="export-summary-card">
                                    <span>COMPLETION</span>
                                    <strong>{reportCompletionRate}%</strong>
                                </div>
                            </div>
                            <div className="productivity-preview-heading">
                                <h3>Card Preview</h3>
                                <span>PNG · HIGH RESOLUTION</span>
                            </div>
                            <div className="productivity-canvas-container">
                                <canvas
                                    ref={reportCanvasRef}
                                    className="productivity-canvas"
                                    role="img"
                                    aria-label={`Productivity report for ${reportPeriodTitle}`}
                                />
                            </div>
                            <button
                                type="button"
                                className="download-productivity-button"
                                onClick={downloadProductivityCard}
                            >
                                ↓ Download Productivity Card (PNG)
                            </button>
                            <p className="export-note">
                                The report includes both completed and pending
                                tasks scheduled during the selected period.
                            </p>
                        </section>
                    )}
                    {/* TASK STATISTICS */}
                    <div className="stats-grid">
                        <div className="stat-card total-stat">
                            <span className="stat-label">TOTAL TASKS</span>
                            <h3>{totalTasks}</h3>
                        </div>
                        <div className="stat-card completed-stat">
                            <span className="stat-label">COMPLETED</span>
                            <h3>{completedTasks}</h3>
                        </div>
                        <button
                            type="button"
                            className={`stat-card pending-stat ${showPendingTasks ? 'active-pending-stat' : ''}`}
                            onClick={() => setShowPendingTasks(!showPendingTasks)}
                            aria-expanded={showPendingTasks}
                        >
                            <span className="stat-label">PENDING</span>
                            <h3>{pendingTasks}</h3>
                            <span className="pending-card-hint">
                                {showPendingTasks
                                    ? 'Hide pending tasks ↑'
                                    : 'View pending tasks ↓'}
                            </span>
                        </button>
                    </div>
                    {/* OVERDUE SUMMARY */}
                    <div className="overdue-summary">
                        <strong>Overdue Tasks: {overdueTasks.length}</strong>
                    </div>
                    {/* PENDING TASKS PANEL */}
                    {showPendingTasks && (
                        <div className="pending-tasks-panel">
                            <div className="pending-panel-heading">
                                <div>
                                    <span className="section-label">
                                        NEEDS YOUR ATTENTION
                                    </span>
                                    <h2>Pending Tasks</h2>
                                </div>
                                <span className="pending-count">
                                    {pendingTasks} LEFT
                                </span>
                            </div>
                            {pendingTaskList.length > 0 ? (
                                <div className="pending-task-list">
                                    {pendingTaskList.map((todo) => (
                                        <div
                                            className="pending-task-item"
                                            key={todo.id}
                                        >
                                            <div className="pending-task-information">
                                                <div>
                                                    <span className="pending-task-name">
                                                        {todo.text}
                                                    </span>
                                                    <p>
                                                        Due: {formatDisplayDate(todo.date)}
                                                        {' · '}
                                                        Priority: {todo.priorityLevel}/5 Stars
                                                        {isOverdue(todo) ? ' · OVERDUE' : ''}
                                                    </p>
                                                    {renderTaskStars(todo.priorityLevel)}
                                                </div>
                                            </div>
                                            <div className="pending-task-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleTask(todo.id)}
                                                >
                                                    Complete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => startEditingTask(todo)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => togglePin(todo.id)}
                                                >
                                                    {todo.pinned ? 'Unpin' : 'Pin'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteTask(todo.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-pending-tasks">
                                    <p>No pending tasks right now.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {/* MONTHLY CALENDAR */}
                    <div className="monthly-calendar-card">
                        <div className="dashboard-calendar-header">
                            <div>
                                <h2>
                                    {visibleMonth.toLocaleDateString(
                                        'en-US',
                                        {
                                            month: 'long',
                                            year: 'numeric'
                                        }
                                    )}
                                </h2>
                                <p>Select a date to view your tasks</p>
                            </div>
                            <div className="month-navigation">
                                <button
                                    type="button"
                                    onClick={() => changeMonth(-1)}
                                    aria-label="Previous month"
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeMonth(1)}
                                    aria-label="Next month"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                        <div className="dashboard-weekdays">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                                (day) => (
                                    <span key={day}>{day}</span>
                                )
                            )}
                        </div>
                        <div className="dashboard-calendar-grid">
                            {calendarDays.map((item) => {
                                const dateString = formatDate(item.date);
                                const isToday = dateString === today;
                                const isSelected = dateString === selectedDate;
                                const dayHasTasks = hasTasks(dateString);
                                return (
                                    <button
                                        type="button"
                                        key={dateString}
                                        className={[
                                            'dashboard-calendar-day',
                                            !item.currentMonth && 'outside-month',
                                            isToday && 'today',
                                            isSelected && 'selected',
                                            dayHasTasks && 'has-task'
                                        ].filter(Boolean).join(' ')}
                                        onClick={() => selectDate(item.date)}
                                    >
                                        <span>{item.date.getDate()}</span>
                                        {dayHasTasks && (
                                            <span className="dashboard-task-indicator"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="calendar-legend">
                            <span>
                                <span className="legend-today"></span>
                                Today
                            </span>
                            <span>
                                <span className="legend-task"></span>
                                Has tasks
                            </span>
                        </div>
                    </div>
                    {/* SELECTED DATE TASKS */}
                    <div className="selected-day-tasks">
                        <div className="selected-date-heading">
                            <div>
                                <span className="section-label">YOUR SCHEDULE</span>
                                <h2>{formatDisplayDate(selectedDate)}</h2>
                            </div>
                            <span className="selected-task-count">
                                {selectedDateTasks.length} TASKS
                            </span>
                        </div>
                        {/* DASHBOARD TASK FORM */}
                        <div className="dashboard-task-form">
                            {renderTaskForm(selectedDate)}
                        </div>
                        {/* SELECTED DATE TASK LIST */}
                        <div className="dashboard-task-list">
                            {selectedDateTasks.length > 0 ? (
                                selectedDateTasks.map((todo) => (
                                    <div
                                        className={`dashboard-task-item ${todo.completed ? 'task-completed' : ''}`}
                                        key={todo.id}
                                    >
                                        <div className="task-information">
                                            <button
                                                type="button"
                                                className="task-complete-button"
                                                onClick={() => toggleTask(todo.id)}
                                            >
                                                {todo.completed ? 'Undo' : 'Complete'}
                                            </button>
                                            <div>
                                                <span className="task-name">
                                                    {todo.text}
                                                </span>
                                                <p>
                                                    Priority Level: {todo.priorityLevel}/5
                                                </p>
                                                {renderTaskStars(todo.priorityLevel)}
                                                {isOverdue(todo) && (
                                                    <span className="overdue-label">
                                                        OVERDUE
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="dashboard-task-actions">
                                            <button
                                                type="button"
                                                onClick={() => startEditingTask(todo)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => togglePin(todo.id)}
                                            >
                                                {todo.pinned ? 'Unpin' : 'Pin'}
                                            </button>
                                            <button
                                                type="button"
                                                className="task-delete-button"
                                                onClick={() => deleteTask(todo.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-day-message">
                                    <h3>No tasks scheduled</h3>
                                    <p>Add a task for this date to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}
            {/* FOOTER */}
            <footer className="app-footer">
                <p>
                    © {new Date().getFullYear()} <strong>WHAT TO-DO?</strong>
                    <span> — Organize. Prioritize. Accomplish.</span>
                </p>
                <p className="footer-credit">
                    Made by <strong>Tapoborata Roy.</strong>
                </p>
            </footer>
        </main>
    );
}
export default App;
