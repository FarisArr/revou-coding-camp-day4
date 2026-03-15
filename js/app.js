// Utility Functions

/**
 * Generate a unique ID using timestamp and random string
 * @returns {string} Unique identifier
 */
function generateId() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${randomStr}`;
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
function saveToStorage(key, data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {any} Parsed data or default value
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            return defaultValue;
        }
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Clear all data from localStorage
 * @returns {boolean} Success status
 */
function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// Greeting Component

/**
 * GreetingComponent - Displays current time, date, and time-based greeting
 */
class GreetingComponent {
    /**
     * @param {HTMLElement} containerElement - The DOM element to render the component into
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.currentTime = new Date();
        this.greeting = '';
        this.intervalId = null;
    }

    /**
     * Initialize the component
     */
    init() {
        this.updateTime();
        this.render();
        // Update time every second
        this.intervalId = setInterval(() => {
            this.updateTime();
            this.render();
        }, 1000);
    }

    /**
     * Update the current time and greeting
     */
    updateTime() {
        this.currentTime = new Date();
        const hour = this.currentTime.getHours();
        this.greeting = this.getGreeting(hour);
    }

    /**
     * Get the appropriate greeting based on the hour
     * @param {number} hour - Hour in 24-hour format (0-23)
     * @returns {string} Greeting message
     */
    getGreeting(hour) {
        // Morning: 5-11, Afternoon: 12-17, Evening: 18-4
        if (hour >= 5 && hour <= 11) {
            return 'Good Morning';
        } else if (hour >= 12 && hour <= 17) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    }

    /**
     * Format time as 12-hour with AM/PM
     * @returns {string} Formatted time string
     */
    formatTime() {
        let hours = this.currentTime.getHours();
        const minutes = this.currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        // Pad minutes with leading zero
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        
        return `${hours}:${minutesStr} ${ampm}`;
    }

    /**
     * Format date as readable string (e.g., "Monday, January 15, 2024")
     * @returns {string} Formatted date string
     */
    formatDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return this.currentTime.toLocaleDateString('en-US', options);
    }

    /**
     * Render the component to the DOM
     */
    render() {
        this.container.innerHTML = `
            <div class="greeting-component">
                <h1 class="greeting-text">${this.greeting}</h1>
                <div class="time-display">${this.formatTime()}</div>
                <div class="date-display">${this.formatDate()}</div>
            </div>
        `;
    }

    /**
     * Clean up the component (clear interval)
     */
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
// Focus Timer Component

/**
 * FocusTimer - 25-minute countdown timer for focused work sessions
 */
class FocusTimer {
    /**
     * @param {HTMLElement} containerElement - The DOM element to render the component into
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.duration = 1500; // 25 minutes in seconds
        this.remainingTime = this.duration;
        this.isRunning = false;
        this.intervalId = null;
    }

    /**
     * Initialize the component
     */
    init() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Start the countdown timer
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
        this.render();
    }

    /**
     * Stop (pause) the countdown timer
     */
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.render();
    }

    /**
     * Reset the timer to initial duration
     */
    reset() {
        this.stop();
        this.remainingTime = this.duration;
        this.render();
    }

    /**
     * Tick function - decrements remaining time and handles completion
     */
    tick() {
        if (this.remainingTime > 0) {
            this.remainingTime--;
            this.render();
        }
        
        // Stop when reaching 0
        if (this.remainingTime === 0) {
            this.stop();
        }
    }

    /**
     * Format seconds as MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        // Pad with leading zeros
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        const secsStr = secs < 10 ? '0' + secs : secs;
        
        return `${minutesStr}:${secsStr}`;
    }

    /**
     * Attach event listeners to buttons
     */
    attachEventListeners() {
        const startBtn = this.container.querySelector('.btn-start');
        const stopBtn = this.container.querySelector('.btn-stop');
        const resetBtn = this.container.querySelector('.btn-reset');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    /**
     * Render the component to the DOM
     */
    render() {
        const displayTime = this.formatTime(this.remainingTime);
        const isComplete = this.remainingTime === 0;
        const completeClass = isComplete ? ' timer-complete' : '';
        
        this.container.innerHTML = `
            <h2 class="component-header">Focus Timer</h2>
            <div class="focus-timer${completeClass}">
                <div class="timer-display">${displayTime}</div>
                <div class="timer-controls">
                    <button class="btn-start" ${this.isRunning ? 'disabled' : ''}>Start</button>
                    <button class="btn-stop" ${!this.isRunning ? 'disabled' : ''}>Stop</button>
                    <button class="btn-reset">Reset</button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners after re-render
        this.attachEventListeners();
    }

    /**
     * Clean up the component (clear interval)
     */
    destroy() {
        this.stop();
    }
}

// Task Manager Component

/**
 * TaskManager - CRUD operations for to-do list with local storage persistence
 */
class TaskManager {
    /**
     * @param {HTMLElement} containerElement - The DOM element to render the component into
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.tasks = [];
        this.storageKey = 'productivity-dashboard-tasks';
    }

    /**
     * Initialize the component
     */
    init() {
        this.loadTasks();
        this.render();
    }

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
        this.tasks = loadFromStorage(this.storageKey, []);
    }

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
        saveToStorage(this.storageKey, this.tasks);
    }

    /**
     * Add a new task
     * @param {string} text - Task description
     * @returns {object|null} Created task object or null if text is empty
     */
    addTask(text) {
        if (!text || text.trim() === '') {
            return null;
        }

        const task = {
            id: generateId(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.render();
        
        return task;
    }

    /**
     * Edit an existing task
     * @param {string} id - Task ID
     * @param {string} newText - New task description
     * @returns {boolean} Success status
     */
    editTask(id, newText) {
        if (!newText || newText.trim() === '') {
            return false;
        }

        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            return false;
        }

        task.text = newText.trim();
        this.saveTasks();
        this.render();
        
        return true;
    }

    /**
     * Toggle task completion status
     * @param {string} id - Task ID
     * @returns {boolean} Success status
     */
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            return false;
        }

        task.completed = !task.completed;
        this.saveTasks();
        this.render();
        
        return true;
    }

    /**
     * Delete a task
     * @param {string} id - Task ID
     * @returns {boolean} Success status
     */
    deleteTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== id);
        
        if (this.tasks.length === initialLength) {
            return false; // Task not found
        }

        this.saveTasks();
        this.render();
        
        return true;
    }

    /**
     * Attach event listeners to task controls
     */
    attachEventListeners() {
        // Add task button
        const addBtn = this.container.querySelector('.btn-add-task');
        const taskInput = this.container.querySelector('.task-input');

        if (addBtn && taskInput) {
            addBtn.addEventListener('click', () => {
                const text = taskInput.value;
                if (this.addTask(text)) {
                    taskInput.value = ''; // Clear input on success
                }
            });

            // Allow Enter key to add task
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = taskInput.value;
                    if (this.addTask(text)) {
                        taskInput.value = ''; // Clear input on success
                    }
                }
            });
        }

        // Task checkboxes
        const checkboxes = this.container.querySelectorAll('.task-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.toggleTask(taskId);
            });
        });

        // Edit buttons
        const editBtns = this.container.querySelectorAll('.btn-edit-task');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                const taskId = taskItem.dataset.id;
                const taskTextSpan = taskItem.querySelector('.task-text');
                const currentText = taskTextSpan.textContent;

                // Prompt for new text
                const newText = prompt('Edit task:', currentText);
                if (newText !== null) {
                    this.editTask(taskId, newText);
                }
            });
        });

        // Delete buttons
        const deleteBtns = this.container.querySelectorAll('.btn-delete-task');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.id;
                this.deleteTask(taskId);
            });
        });
    }

    /**
     * Render the component to the DOM
     */
    render() {
        // Sort tasks by creation time (oldest first)
        const sortedTasks = [...this.tasks].sort((a, b) => a.createdAt - b.createdAt);

        const taskListHTML = sortedTasks.map(task => {
            const completedClass = task.completed ? ' completed' : '';
            const checkedAttr = task.completed ? 'checked' : '';
            
            return `
                <li class="task-item${completedClass}" data-id="${task.id}">
                    <input type="checkbox" class="task-checkbox" ${checkedAttr}>
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <button class="btn-edit-task">Edit</button>
                    <button class="btn-delete-task">Delete</button>
                </li>
            `;
        }).join('');

        this.container.innerHTML = `
            <h2 class="component-header">Tasks</h2>
            <div class="task-manager">
                <div class="task-input-container">
                    <input type="text" class="task-input" placeholder="Add a new task...">
                    <button class="btn-add-task">Add</button>
                </div>
                <ul class="task-list">
                    ${taskListHTML}
                </ul>
            </div>
        `;

        // Re-attach event listeners after re-render
        this.attachEventListeners();
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Link Manager Component

/**
 * LinkManager - Manage quick access links with local storage persistence
 */
class LinkManager {
    /**
     * @param {HTMLElement} containerElement - The DOM element to render the component into
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.links = [];
        this.storageKey = 'productivity-dashboard-links';
    }

    /**
     * Initialize the component
     */
    init() {
        this.loadLinks();
        this.render();
    }

    /**
     * Load links from localStorage
     */
    loadLinks() {
        this.links = loadFromStorage(this.storageKey, []);
    }

    /**
     * Save links to localStorage
     */
    saveLinks() {
        saveToStorage(this.storageKey, this.links);
    }

    /**
     * Add a new link
     * @param {string} text - Display text for the link
     * @param {string} url - Target URL
     * @returns {object|null} Created link object or null if validation fails
     */
    addLink(text, url) {
        // Validate URL is not empty
        if (!this.validateUrl(url)) {
            return null;
        }

        // Text can be empty, but we'll use URL as fallback
        const displayText = text && text.trim() !== '' ? text.trim() : url;

        const link = {
            id: generateId(),
            text: displayText,
            url: url.trim()
        };

        this.links.push(link);
        this.saveLinks();
        this.render();
        
        return link;
    }

    /**
     * Delete a link
     * @param {string} id - Link ID
     * @returns {boolean} Success status
     */
    deleteLink(id) {
        const initialLength = this.links.length;
        this.links = this.links.filter(l => l.id !== id);
        
        if (this.links.length === initialLength) {
            return false; // Link not found
        }

        this.saveLinks();
        this.render();
        
        return true;
    }

    /**
     * Open a link in a new tab
     * @param {string} url - URL to open
     */
    openLink(url) {
        window.open(url, '_blank');
    }

    /**
     * Validate that URL is not empty
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is valid (not empty)
     */
    validateUrl(url) {
        return url && url.trim() !== '';
    }

    /**
     * Attach event listeners to link controls
     */
    attachEventListeners() {
        // Add link button
        const addBtn = this.container.querySelector('.btn-add-link');
        const textInput = this.container.querySelector('.link-text-input');
        const urlInput = this.container.querySelector('.link-url-input');

        if (addBtn && textInput && urlInput) {
            addBtn.addEventListener('click', () => {
                const text = textInput.value;
                const url = urlInput.value;
                if (this.addLink(text, url)) {
                    textInput.value = ''; // Clear inputs on success
                    urlInput.value = '';
                }
            });

            // Allow Enter key to add link from either input
            const handleEnter = (e) => {
                if (e.key === 'Enter') {
                    const text = textInput.value;
                    const url = urlInput.value;
                    if (this.addLink(text, url)) {
                        textInput.value = ''; // Clear inputs on success
                        urlInput.value = '';
                    }
                }
            };

            textInput.addEventListener('keypress', handleEnter);
            urlInput.addEventListener('keypress', handleEnter);
        }

        // Link anchors
        const linkAnchors = this.container.querySelectorAll('.link-anchor');
        linkAnchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                const url = anchor.dataset.url;
                this.openLink(url);
            });
        });

        // Delete buttons
        const deleteBtns = this.container.querySelectorAll('.btn-delete-link');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const linkId = e.target.closest('.link-item').dataset.id;
                this.deleteLink(linkId);
            });
        });
    }

    /**
     * Render the component to the DOM
     */
    render() {
        const linkListHTML = this.links.map(link => {
            return `
                <li class="link-item" data-id="${link.id}">
                    <a href="#" class="link-anchor" data-url="${this.escapeHtml(link.url)}">${this.escapeHtml(link.text)}</a>
                    <button class="btn-delete-link">Delete</button>
                </li>
            `;
        }).join('');

        this.container.innerHTML = `
            <h2 class="component-header">Quick Links</h2>
            <div class="link-manager">
                <div class="link-input-container">
                    <input type="text" class="link-text-input" placeholder="Link name">
                    <input type="text" class="link-url-input" placeholder="URL">
                    <button class="btn-add-link">Add Link</button>
                </div>
                <ul class="link-list">
                    ${linkListHTML}
                </ul>
            </div>
        `;

        // Re-attach event listeners after re-render
        this.attachEventListeners();
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Application Initialization

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Greeting Component
    const greetingContainer = document.getElementById('greeting-container');
    if (greetingContainer) {
        const greeting = new GreetingComponent(greetingContainer);
        greeting.init();
    }
    
    // Initialize Focus Timer
    const timerContainer = document.getElementById('timer-container');
    if (timerContainer) {
        const timer = new FocusTimer(timerContainer);
        timer.init();
    }

    // Initialize Task Manager
    const tasksContainer = document.getElementById('tasks-container');
    if (tasksContainer) {
        const taskManager = new TaskManager(tasksContainer);
        taskManager.init();
    }

    // Initialize Link Manager
    const linksContainer = document.getElementById('links-container');
    if (linksContainer) {
        const linkManager = new LinkManager(linksContainer);
        linkManager.init();
    }
});
