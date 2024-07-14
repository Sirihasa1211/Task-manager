document.addEventListener('DOMContentLoaded', () => {
    let tasks = [];
    let recentActivity = [];

    // Load tasks and recent activity from local storage
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    if (localStorage.getItem('recentActivity')) {
        recentActivity = JSON.parse(localStorage.getItem('recentActivity'));
        renderRecentActivity(); // Render recent activity when page loads
    }

    // Set min attribute of taskDate input to today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDate').setAttribute('min', today);

    // Save tasks to Local Storage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Save recent activity to Local Storage
    function saveRecentActivityToLocalStorage() {
        localStorage.setItem('recentActivity', JSON.stringify(recentActivity));
    }

    // Add task
    function addTask(taskName, taskDate, taskTime) {
        const taskDateTime = new Date(`${taskDate}T${taskTime}`);
        const currentDate = new Date();
        if (taskDateTime >= currentDate) {
            tasks.push({ name: taskName, dateTime: taskDateTime });
            renderTasks();
            renderTasksForToday();
            saveTasksToLocalStorage();
        } else {
            alert('Please select a future date and time for the task.');
        }
    }

    // Render tasks
    function renderTasks() {
        const taskList = document.querySelector('.project-tasks');
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <p>${task.name}</p>
                <p>${task.dateTime.toLocaleString()}</p>
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="accomplish-btn" data-index="${index}">Accomplish</button>
            `;
            taskList.appendChild(taskElement);
        });
    }

    // Render tasks for today
    function renderTasksForToday() {
         const tasksTodayList = document.getElementById('tasksToday');
    tasksTodayList.innerHTML = '';
    const todayDate = new Date().toDateString();
    tasks.forEach((task, index) => {
        // Check if task.dateTime is a valid date object
        if (task.dateTime instanceof Date) {
            const taskDate = task.dateTime.toDateString();
            if (taskDate === todayDate) {
                const taskItem = document.createElement('li');
                taskItem.textContent = task.name;
                tasksTodayList.appendChild(taskItem);
            }
        }
    });
    }

    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
        renderTasksForToday();
        saveTasksToLocalStorage();
    }

    // Mark task as accomplished
    function markAccomplished(index) {
        const task = tasks[index];
        const currentDate = new Date();
        if (task.dateTime < currentDate) {
            task.status = 'Unaccomplished';
            renderRecentActivity({ taskName: task.name, date: currentDate.toDateString() });
        } else {
            task.status = 'Accomplished';
            renderRecentActivity({ taskName: task.name, date: currentDate.toDateString() });
            tasks.splice(index, 1);
        }
        renderTasks();
        renderTasksForToday();
        saveTasksToLocalStorage();
    }

    // Delete and Accomplish task click events (Event Delegation)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const index = event.target.getAttribute('data-index');
            deleteTask(index);
        } else if (event.target.classList.contains('accomplish-btn')) {
            const index = event.target.getAttribute('data-index');
            markAccomplished(index);
        }
    });

    // Render recent activity
    function renderRecentActivity() {
        const recentActivityList = document.getElementById('recentActivityList');
        recentActivityList.innerHTML = ''; // Clear existing list items
        recentActivity.forEach((activity) => {
            const activityItem = document.createElement('li');
            activityItem.innerHTML = `${activity.taskName} - ${activity.date}`;
            recentActivityList.appendChild(activityItem);
        });
    }

    // Add Task button click event
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskTime = document.getElementById('taskTime').value;
        addTask(taskName, taskDate, taskTime);
    });

    // Initial rendering
    renderTasks();
    renderTasksForToday();
});
