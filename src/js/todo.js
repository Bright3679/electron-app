document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'src/pages/login.html';
    } else {
        loadTasks();
        showPage('all');
    }
});

function addTask() {
    const taskInput = document.getElementById('new-task');
    const categorySelect = document.getElementById('category');
    const prioritySelect = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        const newTask = document.createElement('li');
        newTask.setAttribute('data-category', category);
        newTask.setAttribute('data-priority', priority);

        newTask.innerHTML = `
            <input type="checkbox" onchange="toggleTaskCompletion(this)">
            <span class="task-text">${taskText}</span>
            <span class="due-date">${dueDate}</span>
            <select onchange="updatePriority(this)">
              <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
            </select>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        `;

        taskList.appendChild(newTask);
        saveTasks();
        taskInput.value = '';
        dueDateInput.value = '';
    }
}

function deleteTask(button) {
    const task = button.parentElement;
    task.remove();
    saveTasks();
}

function editTask(button) {
    const task = button.parentElement;
    const taskText = task.querySelector('.task-text').textContent;
    const priority = task.getAttribute('data-priority');
    const dueDate = task.querySelector('.due-date').textContent;

    document.getElementById('edit-task-text').value = taskText;
    document.getElementById('edit-task-priority').value = priority;
    document.getElementById('edit-task-due-date').value = dueDate;
    document.getElementById('edit-modal').style.display = 'block';

    window.currentTask = task;
}

function saveTask() {
    const taskText = document.getElementById('edit-task-text').value.trim();
    const priority = document.getElementById('edit-task-priority').value;
    const dueDate = document.getElementById('edit-task-due-date').value;

    if (taskText !== '') {
        window.currentTask.querySelector('.task-text').textContent = taskText;
        window.currentTask.setAttribute('data-priority', priority);
        window.currentTask.querySelector('.due-date').textContent = dueDate;

        saveTasks();
        closeModal();
    }
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function updatePriority(select) {
    const task = select.parentElement;
    task.setAttribute('data-priority', select.value);
    saveTasks();
}

function toggleTaskCompletion(checkbox) {
    const task = checkbox.parentElement;
    if (checkbox.checked) {
        task.classList.add('completed');
    } else {
        task.classList.remove('completed');
    }
    saveTasks();
}

function filterTasks(category) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        if (category === 'all' || (category === 'completed' && task.classList.contains('completed')) || task.getAttribute('data-category') === category) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function saveTasks() {
    const tasks = [];
    const currentUser = localStorage.getItem('currentUser');
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-text').textContent,
            priority: task.getAttribute('data-priority'),
            dueDate: task.querySelector('.due-date').textContent,
            category: task.getAttribute('data-category'),
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
}

function loadTasks() {
    const currentUser = localStorage.getItem('currentUser');
    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    const taskList = document.getElementById('task-list');
    tasks.forEach(taskData => {
        const newTask = document.createElement('li');
        newTask.setAttribute('data-category', taskData.category);
        newTask.setAttribute('data-priority', taskData.priority);
        if (taskData.completed) {
            newTask.classList.add('completed');
        }

        newTask.innerHTML = `
            <input type="checkbox" onchange="toggleTaskCompletion(this)" ${taskData.completed ? 'checked' : ''}>
            <span class="task-text">${taskData.text}</span>
            <span class="due-date">${taskData.dueDate}</span>
            <select onchange="updatePriority(this)">
              <option value="low" ${taskData.priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${taskData.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="high" ${taskData.priority === 'high' ? 'selected' : ''}>High</option>
            </select>
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        `;

        taskList.appendChild(newTask);
    });
}

function showPage(category) {
    filterTasks(category);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'src/pages/login.html';
}
