
import React, { useEffect, useRef, useState } from 'react';

function CustomDropdown({
    value,
    onChange,
    options,
    ariaLabel,
    className = ''
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div
            className={`custom-dropdown ${className}`}
            ref={dropdownRef}
        >
            <button
                type="button"
                className={`custom-dropdown-trigger ${isOpen ? 'dropdown-open' : ''}`}
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>
                    {selectedOption?.label || 'Select an option'}
                </span>

                <span className="custom-dropdown-arrow">
                    {isOpen ? '▲' : '▼'}
                </span>
            </button>

            {isOpen && (
                <div
                    className="custom-dropdown-menu"
                    role="listbox"
                    aria-label={ariaLabel}
                >
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={`custom-dropdown-option ${
                                value === option.value ? 'selected' : ''
                            }`}
                            role="option"
                            aria-selected={value === option.value}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span>{option.label}</span>

                            {value === option.value && (
                                <span className="dropdown-check">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function TaskSearch({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    onClearFilters,
    hasActiveSearchFilters,
    resultCount,
}) {
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'overdue', label: 'Overdue' }
    ];

    const priorityOptions = [
        { value: 'all', label: 'All Priority Levels' },
        { value: '1', label: '1 Star' },
        { value: '2', label: '2 Stars' },
        { value: '3', label: '3 Stars' },
        { value: '4', label: '4 Stars' },
        { value: '5', label: '5 Stars' }
    ];

    const sortOptions = [
        { value: 'default', label: 'Default Order' },
        { value: 'due-date', label: 'Sort by Due Date' },
        { value: 'priority', label: 'Highest Priority First' },
        { value: 'created', label: 'Newest First' }
    ];

    return (
        <div className="task-controls-panel">
            <div className="task-controls-heading">
                <h3>Search & Filter Tasks</h3>

                {hasActiveSearchFilters && (
                    <button
                        type="button"
                        className="clear-search-filters"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="task-controls">
                <input
                    type="search"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    aria-label="Search tasks"
                />

                <CustomDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    ariaLabel="Filter by status"
                />

                <CustomDropdown
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    options={priorityOptions}
                    ariaLabel="Filter by priority level"
                />

                <CustomDropdown
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                    ariaLabel="Sort tasks"
                />
            </div>

            <p className="search-results-count">
                {resultCount} {resultCount === 1 ? 'task' : 'tasks'} found
            </p>
        </div>
    );
}

export default TaskSearch;
