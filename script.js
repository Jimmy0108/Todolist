//758633f65a8b503d12caf2154a95ea46 Weather API
document.getElementById('add-task-button').addEventListener('click', addTask);
document.getElementById('city-select').addEventListener('change', updateWeather);

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleString();

    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'task';
    taskItem.dataset.addedTime = now.toISOString();

    const taskNumber = document.createElement('span');
    taskNumber.className = 'task-number';
    taskNumber.textContent = taskList.children.length + 1;

    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;

    const taskTime = document.createElement('span');
    taskTime.className = 'task-time';
    taskTime.textContent = ` (Added on: ${formattedTime})`;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.className = 'complete-button';
    completeButton.addEventListener('click', toggleComplete);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', deleteTask);

    taskItem.appendChild(taskNumber);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskTime);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    taskInput.value = '';

    updateCookie();
}

function toggleComplete(event) {
    const taskItem = event.target.parentNode;
    taskItem.classList.toggle('complete');

    const now = new Date();
    const addedTime = new Date(taskItem.dataset.addedTime);
    const timeDiff = Math.round((now - addedTime) / 1000); // Time difference in seconds

    const hours = Math.floor(timeDiff / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;

    let timeTaken = '';
    if (hours > 0) timeTaken += `${hours} hours `;
    if (minutes > 0) timeTaken += `${minutes} minutes `;
    timeTaken += `${seconds} seconds`;

    if (!taskItem.classList.contains('complete')) {
        const completionInfo = taskItem.querySelector('.completion-info');
        if (completionInfo) {
            completionInfo.remove();
        }
        updateCookie();
        return;
    }

    const formattedTime = now.toLocaleString();
    const completionInfo = document.createElement('span');
    completionInfo.className = 'completion-info';
    completionInfo.textContent = ` (Completed on: ${formattedTime}, Time taken: ${timeTaken})`;

    taskItem.appendChild(completionInfo);
    updateCookie();
}

function deleteTask(event) {
    const taskItem = event.target.parentNode;
    taskItem.remove();
    updateTaskNumbers();
    updateCookie();
}

// Function to update the current time
function updateTime() {
    const now = new Date();
    const currentTimeElement = document.getElementById('current-time');
    currentTimeElement.textContent = now.toLocaleString();
}

// Update the time every second
setInterval(updateTime, 1000);

// Initial call to set the time immediately on load
updateTime();

// Function to fetch and display weather information
async function updateWeather() {
    const apiKey = '758633f65a8b503d12caf2154a95ea46'; // 替換為您的 OpenWeatherMap API 金鑰
    const citySelect = document.getElementById('city-select');
    const city = citySelect.value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const weatherData = await response.json();
        const weatherElement = document.getElementById('weather');
        weatherElement.textContent = `Weather in ${city}: ${weatherData.weather[0].description}, ${weatherData.main.temp}°C`;
    } catch (error) {
        const weatherElement = document.getElementById('weather');
        weatherElement.textContent = 'Failed to fetch weather data';
        console.error('Failed to fetch weather data:', error);
    }
}

// Initial call to set the weather immediately on load
updateWeather();

// Update the weather every 10 minutes
setInterval(updateWeather, 600000);

// Function to update the cookie with the current task list
function updateCookie() {
    const taskList = document.getElementById('task-list');
    const tasks = [];
    taskList.querySelectorAll('.task').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const addedTime = task.dataset.addedTime;
        const isComplete = task.classList.contains('complete');
        tasks.push({ text: taskText, addedTime, isComplete });
    });
    document.cookie = `tasks=${JSON.stringify(tasks)}; path=/;`;
}

// Function to load tasks from the cookie
function loadTasksFromCookie() {
    const cookies = document.cookie.split('; ');
    const tasksCookie = cookies.find(cookie => cookie.startsWith('tasks='));
    if (!tasksCookie) return;

    const tasks = JSON.parse(tasksCookie.split('=')[1]);
    tasks.forEach(task => {
        const now = new Date(task.addedTime);
        const formattedTime = now.toLocaleString();

        const taskList = document.getElementById('task-list');
        const taskItem = document.createElement('li');
        taskItem.className = 'task';
        taskItem.dataset.addedTime = task.addedTime;

        const taskNumber = document.createElement('span');
        taskNumber.className = 'task-number';
        taskNumber.textContent = taskList.children.length + 1;

        const taskContent = document.createElement('span');
        taskContent.textContent = task.text;

        const taskTime = document.createElement('span');
        taskTime.className = 'task-time';
        taskTime.textContent = ` (Added on: ${formattedTime})`;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete-button';
        completeButton.addEventListener('click', toggleComplete);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', deleteTask);

        taskItem.appendChild(taskNumber);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskTime);
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        if (task.isComplete) {
            taskItem.classList.add('complete');
            toggleComplete({ target: completeButton });
        }
    });
}

// Function to update the task numbers after deletion
function updateTaskNumbers() {
    const taskList = document.getElementById('task-list');
    taskList.querySelectorAll('.task-number').forEach((taskNumber, index) => {
        taskNumber.textContent = index + 1;
    });
}

// Load tasks from the cookie when the page loads
window.onload = loadTasksFromCookie;
