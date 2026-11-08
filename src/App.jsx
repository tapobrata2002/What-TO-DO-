
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {

    // =========================================
    // DATE FUNCTIONS
    // =========================================

    const getToday = () => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const today = getToday();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (date) => {
        if (!date) return 'Choose a due date';

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


    // =========================================
    // STATES
    // =========================================

    const [todos, setTodos] = useState(() => {
        try {
            const savedTodos = localStorage.getItem('what-to-do-tasks');
            return savedTodos ? JSON.parse(savedTodos) : [];
        } catch {
            return [];
        }
    });

    // Main page states
    const [input, setInput] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [activeView, setActiveView] = useState('tasks');

    // Pending panel
    const [showPendingTasks, setShowPendingTasks] = useState(false);

    // Calendar states
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

    // Productivity export states
    const [showExport, setShowExport] = useState(false);
    const [exportPeriod, setExportPeriod] = useState('weekly');
    const [reportDate, setReportDate] = useState(() => new Date());

    // Canvas reference
    const reportCanvasRef = useRef(null);


    // =========================================
    // LOCAL STORAGE
    // =========================================

    useEffect(() => {
        localStorage.setItem(
            'what-to-do-tasks',
            JSON.stringify(todos)
        );
    }, [todos]);


    // =========================================
    // TASK FUNCTIONS
    // =========================================

    const addTask = (date = dueDate) => {
        if (input.trim() === '') return;

        const newTodo = {
            id: Date.now(),
            text: input.trim(),
            date,
            completed: false,
            priority: 'Medium',
            category: 'Personal'
        };

        setTodos((previousTodos) => [
            ...previousTodos,
            newTodo
        ]);

        setInput('');
        setDueDate('');
        setCalendarOpen(false);
    };

    const deleteTask = (id) => {
        setTodos((previousTodos) =>
            previousTodos.filter((todo) => todo.id !== id)
        );
    };

    const toggleTask = (id) => {
        setTodos((previousTodos) =>
            previousTodos.map((todo) =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
    };


    // =========================================
    // CALENDAR FUNCTIONS
    // =========================================

    const generateCalendarDays = (monthDate) => {
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


    // =========================================
    // TASK FILTERING AND STATISTICS
    // =========================================

    const getTasksForDate = (date) => {
        return todos.filter((todo) => {
            if (!todo.date) {
                return date === today;
            }

            return todo.date === date;
        });
    };

    const selectedDateTasks = getTasksForDate(selectedDate);

    const totalTasks = todos.length;

    const completedTasks = todos.filter(
        (todo) => todo.completed
    ).length;

    const pendingTaskList = todos.filter(
        (todo) => !todo.completed
    );

    const pendingTasks = pendingTaskList.length;

    const hasTasks = (dateString) => {
        return getTasksForDate(dateString).length > 0;
    };


    // =========================================
    // PRODUCTIVITY REPORT DATE RANGE
    // =========================================

    const getReportDateRange = () => {
        const year = reportDate.getFullYear();
        const month = reportDate.getMonth();

        if (exportPeriod === 'weekly') {
            const start = new Date(reportDate);
            const day = start.getDay();

            const difference = day === 0 ? -6 : 1 - day;

            start.setDate(start.getDate() + difference);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);

            return { start, end };
        }

        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);

        return { start, end };
    };

    const { start, end } = getReportDateRange();

    const reportStartDate = formatDate(start);
    const reportEndDate = formatDate(end);

    const reportTasks = todos.filter((task) => {
        const taskDate = task.date || today;

        return (
            taskDate >= reportStartDate &&
            taskDate <= reportEndDate
        );
    });

    const reportCompletedTasks = reportTasks.filter(
        (task) => task.completed
    );

    const reportPendingTasks = reportTasks.filter(
        (task) => !task.completed
    );

    const reportCompletionRate = reportTasks.length > 0
        ? Math.round(
            (reportCompletedTasks.length / reportTasks.length) * 100
        )
        : 0;


    // =========================================
    // REPORT DISPLAY INFORMATION
    // =========================================

    const reportPeriodTitle = exportPeriod === 'weekly'
        ? `${start.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })} – ${end.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })}`
        : reportDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

    const changeReportPeriod = (direction) => {
        setReportDate((previousDate) => {
            if (exportPeriod === 'weekly') {
                const nextDate = new Date(previousDate);
                nextDate.setDate(nextDate.getDate() + direction * 7);
                return nextDate;
            }

            return new Date(
                previousDate.getFullYear(),
                previousDate.getMonth() + direction,
                1
            );
        });
    };

    const changeExportPeriod = (period) => {
        setExportPeriod(period);
        setReportDate(new Date());
    };


    // =========================================
    // CANVAS DRAWING HELPERS
    // =========================================

    const drawRoundedRect = (ctx, x, y, width, height, radius) => {
        const r = Math.min(radius, width / 2, height / 2);

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - r,
            y + height
        );
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    const drawWrappedText = (
        ctx,
        text,
        x,
        y,
        maxWidth,
        lineHeight,
        maxLines = 2
    ) => {
        const words = String(text).split(/\s+/);
        let line = '';
        let lineCount = 0;

        for (let i = 0; i < words.length; i++) {
            const testLine = line ? `${line} ${words[i]}` : words[i];

            if (ctx.measureText(testLine).width > maxWidth && line) {
                ctx.fillText(line, x, y + lineCount * lineHeight);
                lineCount++;

                if (lineCount >= maxLines) {
                    return;
                }

                line = words[i];
            } else {
                line = testLine;
            }
        }

        if (line && lineCount < maxLines) {
            ctx.fillText(line, x, y + lineCount * lineHeight);
        }
    };


    // =========================================
    // DRAW PRODUCTIVITY CARD
    // =========================================

    const drawProductivityCard = () => {
        const canvas = reportCanvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const width = 1080;

        const displayedTasks = reportCompletedTasks.slice(0, 12);

        const extraTasks = Math.max(
            0,
            reportCompletedTasks.length - displayedTasks.length
        );

        const taskRowHeight = 86;

        const listHeight = displayedTasks.length > 0
            ? displayedTasks.length * taskRowHeight
            : 150;

        const height =
            885 +
            listHeight +
            (extraTasks > 0 ? 65 : 0);

        canvas.width = width;
        canvas.height = height;

        // Background
        ctx.fillStyle = '#F5F1E8';
        ctx.fillRect(0, 0, width, height);

        // Main card shadow
        drawRoundedRect(ctx, 65, 55, 950, height - 110, 34);
        ctx.fillStyle = '#1C1C1C';
        ctx.fill();

        // Main card
        drawRoundedRect(ctx, 50, 40, 950, height - 110, 34);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.lineWidth = 7;
        ctx.strokeStyle = '#1C1C1C';
        ctx.stroke();

        // Header accent
        drawRoundedRect(ctx, 85, 75, 880, 170, 24);
        ctx.fillStyle = '#F5D547';
        ctx.fill();

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#1C1C1C';
        ctx.stroke();

        // Brand
        ctx.fillStyle = '#1C1C1C';
        ctx.font = '900 27px Arial';
        ctx.fillText('WHAT TO-DO?', 115, 125);

        // Main title
        ctx.font = '900 58px Arial';
        ctx.fillText('PRODUCTIVITY', 115, 190);

        // Report period
        ctx.font = 'bold 25px Arial';
        ctx.fillText(
            `${exportPeriod.toUpperCase()} REPORT  ·  ${reportPeriodTitle}`,
            115,
            225
        );

        // Completion percentage
        ctx.font = '900 100px Arial';
        ctx.fillText(`${reportCompletionRate}%`, 115, 385);

        ctx.font = 'bold 27px Arial';
        ctx.fillText('COMPLETION RATE', 120, 430);

        // Progress bar background
        drawRoundedRect(ctx, 115, 460, 790, 28, 14);
        ctx.fillStyle = '#E8E5DC';
        ctx.fill();

        // Progress bar fill
        if (reportCompletionRate > 0) {
            drawRoundedRect(
                ctx,
                115,
                460,
                Math.max(28, 790 * reportCompletionRate / 100),
                28,
                14
            );

            ctx.fillStyle = '#F5D547';
            ctx.fill();
        }

        // Statistics cards
        const statY = 530;
        const statWidth = 245;
        const statHeight = 125;
        const statGap = 45;

        const stats = [
            {
                label: 'TOTAL TASKS',
                value: reportTasks.length,
                color: '#F5D547'
            },
            {
                label: 'COMPLETED',
                value: reportCompletedTasks.length,
                color: '#DDF5E5'
            },
            {
                label: 'PENDING',
                value: reportPendingTasks.length,
                color: '#FCE5E5'
            }
        ];

        stats.forEach((stat, index) => {
            const x = 115 + index * (statWidth + statGap);

            drawRoundedRect(
                ctx,
                x + 8,
                statY + 8,
                statWidth,
                statHeight,
                20
            );

            ctx.fillStyle = '#1C1C1C';
            ctx.fill();

            drawRoundedRect(
                ctx,
                x,
                statY,
                statWidth,
                statHeight,
                20
            );

            ctx.fillStyle = stat.color;
            ctx.fill();

            ctx.lineWidth = 5;
            ctx.strokeStyle = '#1C1C1C';
            ctx.stroke();

            ctx.fillStyle = '#1C1C1C';
            ctx.font = '900 45px Arial';
            ctx.fillText(String(stat.value), x + 22, statY + 58);

            ctx.font = 'bold 18px Arial';
            ctx.fillText(stat.label, x + 22, statY + 96);
        });

        // Completed task heading
        const listStartY = 710;

        ctx.fillStyle = '#1C1C1C';
        ctx.font = '900 30px Arial';
        ctx.fillText('COMPLETED TASKS', 115, listStartY);

        ctx.font = 'bold 19px Arial';
        ctx.fillStyle = '#777777';

        ctx.fillText(
            `${reportCompletedTasks.length} TASKS COMPLETED`,
            115,
            listStartY + 35
        );

        if (displayedTasks.length === 0) {
            ctx.fillStyle = '#777777';
            ctx.font = 'bold 25px Arial';

            ctx.fillText(
                'No completed tasks in this period yet.',
                115,
                listStartY + 105
            );
        } else {
            displayedTasks.forEach((task, index) => {
                const y = listStartY + 75 + index * taskRowHeight;

                // Task row
                drawRoundedRect(ctx, 115, y, 790, 65, 16);

                ctx.fillStyle = '#F5F1E8';
                ctx.fill();

                ctx.lineWidth = 3;
                ctx.strokeStyle = '#1C1C1C';
                ctx.stroke();

                // Completed status label — no checkbox graphic
                drawRoundedRect(ctx, 130, y + 15, 135, 35, 12);

                ctx.fillStyle = '#DDF5E5';
                ctx.fill();

                ctx.lineWidth = 2;
                ctx.strokeStyle = '#1C1C1C';
                ctx.stroke();

                ctx.fillStyle = '#16803C';
                ctx.font = 'bold 15px Arial';
                ctx.fillText('COMPLETED', 145, y + 38);

                // Task name
                ctx.fillStyle = '#1C1C1C';
                ctx.font = 'bold 23px Arial';

                drawWrappedText(
                    ctx,
                    task.text,
                    290,
                    y + 28,
                    570,
                    27,
                    2
                );
            });
        }

        if (extraTasks > 0) {
            ctx.fillStyle = '#303030';
            ctx.font = 'bold 21px Arial';

            ctx.fillText(
                `+ ${extraTasks} more completed tasks`,
                115,
                listStartY + 75 + displayedTasks.length * taskRowHeight
            );
        }

        // No author credit or extra footer on the report card.
    };


    // =========================================
    // UPDATE CANVAS PREVIEW
    // =========================================

    useEffect(() => {
        if (showExport) {
            drawProductivityCard();
        }
    }, [
        showExport,
        exportPeriod,
        reportDate,
        todos,
        reportCompletionRate
    ]);


    // =========================================
    // DOWNLOAD PRODUCTIVITY CARD
    // =========================================

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


    // =========================================
    // VIEW NAVIGATION
    // =========================================

    const openDashboard = () => {
        setActiveView('dashboard');
        setCalendarOpen(false);
    };

    const openTasks = () => {
        setActiveView('tasks');
        setShowExport(false);
    };


    // =========================================
    // MAIN UI
    // =========================================

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

                <div className="header-spacer" aria-hidden="true"></div>

                <p>Organize your day, one task at a time.</p>

            </header>


            {/* VIEW NAVIGATION */}

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


            {/* =========================================
                MAIN TASK PAGE
            ========================================= */}

            {activeView === 'tasks' && (

                <section className="todo-section">

                    <div className="todo-form">

                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addTask();
                            }}
                        />

                        {/* CUSTOM DATE PICKER */}

                        <div className="date-picker-container">

                            <button
                                type="button"
                                className="date-picker-trigger"
                                onClick={() => setCalendarOpen(!calendarOpen)}
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

                                            return (
                                                <button
                                                    type="button"
                                                    key={dateString}
                                                    className={[
                                                        'calendar-day',
                                                        !item.currentMonth && 'outside-month',
                                                        dateString === today && 'today',
                                                        dateString === dueDate && 'selected',
                                                        hasTasks(dateString) && 'has-task'
                                                    ].filter(Boolean).join(' ')}
                                                    onClick={() => selectDueDate(item.date)}
                                                >
                                                    {item.date.getDate()}

                                                    {hasTasks(dateString) && (
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

                        <button
                            type="button"
                            onClick={() => addTask()}
                        >
                            Add Task
                        </button>

                    </div>


                    {/* ALL TASKS */}

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
                                                    : 'none',
                                                color: todo.completed
                                                    ? '#999999'
                                                    : '#1C1C1C'
                                            }}
                                        >
                                            {todo.text}
                                        </span>

                                        <p>
                                            Due: {todo.date
                                                ? formatDisplayDate(todo.date)
                                                : 'Due Today'}
                                        </p>

                                    </div>

                                    <div className="home-task-actions">

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

            )}


            {/* =========================================
                PRODUCTIVITY DASHBOARD
            ========================================= */}

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
                                Turn your completed tasks into a report card.
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


                    {/* PRODUCTIVITY EXPORT SECTION */}

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

                                {/* <button
                                    type="button"
                                    className="export-close-button"
                                    onClick={() => setShowExport(false)}
                                    aria-label="Close productivity report"
                                >
                                    ×
                                </button> */}

                            </div>


                            {/* PERIOD SELECTOR */}

                            <div className="export-period-selector">

                                <button
                                    type="button"
                                    className={exportPeriod === 'weekly' ? 'active' : ''}
                                    onClick={() => changeExportPeriod('weekly')}
                                >
                                    Weekly Report
                                </button>

                                <button
                                    type="button"
                                    className={exportPeriod === 'monthly' ? 'active' : ''}
                                    onClick={() => changeExportPeriod('monthly')}
                                >
                                    Monthly Report
                                </button>

                            </div>


                            {/* PERIOD NAVIGATION */}

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


                            {/* REPORT SUMMARY */}

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


                            {/* CANVAS PREVIEW */}

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


                            {/* DOWNLOAD BUTTON */}

                            <button
                                type="button"
                                className="download-productivity-button"
                                onClick={downloadProductivityCard}
                            >
                                ↓ Download Productivity Card (PNG)
                            </button>

                            <p className="export-note">
                                Your report includes tasks scheduled during the selected period.
                                Only completed tasks appear in the completed-task list.
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
                                                        Due: {todo.date
                                                            ? formatDisplayDate(todo.date)
                                                            : 'Due Today'}
                                                        {' · '}
                                                        {todo.priority || 'Medium'} Priority
                                                        {' · '}
                                                        {todo.category || 'Personal'}
                                                    </p>
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
                                const hasTask = hasTasks(dateString);

                                return (
                                    <button
                                        type="button"
                                        key={dateString}
                                        className={[
                                            'dashboard-calendar-day',
                                            !item.currentMonth && 'outside-month',
                                            isToday && 'today',
                                            isSelected && 'selected',
                                            hasTask && 'has-task'
                                        ].filter(Boolean).join(' ')}
                                        onClick={() => selectDate(item.date)}
                                    >

                                        <span>{item.date.getDate()}</span>

                                        {hasTask && (
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


                        {/* ADD TASK FORM */}

                        <div className="dashboard-task-form">

                            <input
                                type="text"
                                placeholder="What do you need to do?"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addTask(selectedDate);
                                    }
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => addTask(selectedDate)}
                            >
                                + Add Task
                            </button>

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
                                                    {todo.priority || 'Medium'} Priority
                                                    {' · '}
                                                    {todo.category || 'Personal'}
                                                </p>
                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            className="task-delete-button"
                                            onClick={() => deleteTask(todo.id)}
                                        >
                                            Delete
                                        </button>

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
