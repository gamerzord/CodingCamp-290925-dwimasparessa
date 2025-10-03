// Task data storage
let tasks = [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

// Theme toggle button
const themeToggle = document.createElement('button');
themeToggle.textContent = '🌓';
themeToggle.className =
  'absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  renderTasks();
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.remove('dark');
}

// Add task function
function addTask() {
  const taskText = taskInput.value.trim();
  const taskDate = dateInput.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    completed: false
  };

  tasks.push(task);
  taskInput.value = '';
  dateInput.value = '';
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// Toggle completion
function toggleComplete(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

// Filter buttons
function filterTasks(filter) {
  currentFilter = filter;

  // Update button colors based on dark mode
  const isDark = document.documentElement.classList.contains('dark');

  filterBtns.forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.remove(
        isDark ? 'bg-gray-700' : 'bg-gray-200',
        isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
      );
      btn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-500');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-500');
      btn.classList.add(
        isDark ? 'bg-gray-700' : 'bg-gray-200',
        isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
      );
    }
  });

  renderTasks();
}

// Filter logic
function getFilteredTasks() {
  const today = new Date().toISOString().split('T')[0];
  switch (currentFilter) {
    case 'today':
      return tasks.filter(t => t.date === today);
    case 'upcoming':
      return tasks.filter(t => t.date > today);
    case 'completed':
      return tasks.filter(t => t.completed);
    default:
      return tasks;
  }
}

// Date format
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Render tasks
function renderTasks() {
  const filteredTasks = getFilteredTasks();
  const isDark = document.documentElement.classList.contains('dark');

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  taskList.innerHTML = filteredTasks
    .map(task => {
      const textColor = task.completed
        ? 'line-through text-gray-400'
        : isDark
        ? 'text-gray-100'
        : 'text-gray-800';

      const dateColor = isDark ? 'text-gray-400' : 'text-gray-500';
      const bgColor = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';

      return `
        <div class="task-item ${bgColor} flex items-center gap-3 p-3 rounded-lg transition">
          <input 
            type="checkbox" 
            ${task.completed ? 'checked' : ''} 
            onchange="toggleComplete(${task.id})"
            class="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          >
          <div class="flex-1">
            <p class="${textColor} font-medium">${task.text}</p>
            ${task.date ? `<p class="text-sm ${dateColor} mt-1">${formatDate(task.date)}</p>` : ''}
          </div>
          <button 
            onclick="deleteTask(${task.id})"
            class="delete-btn text-red-400 hover:text-red-500 font-semibold"
          >
            Delete
          </button>
        </div>
      `;
    })
    .join('');
}

// Events
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
filterBtns.forEach(btn => btn.addEventListener('click', () => filterTasks(btn.dataset.filter)));

// Init
filterTasks('all');