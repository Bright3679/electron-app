document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    const token = localStorage.getItem('token');

    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task === '') {
            Swal.fire({
                title: 'Input Task',
                text: 'Please enter a task!',
                icon: 'error',
                backdrop: false,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            })
        }
        try {
            const response = await fetch('http://localhost:3000/api/insertTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, task })
            })
            const data = await response.json();

            if (response.ok) {
                // Swal.fire('Success', 'Task inserted successfully', 'success');
                addTodoItem(task);
                todoInput.value = '';
            } else {
                // Swal.fire('Error', data.message || 'Error inserting task', 'error');
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'Error inserting task',
                    icon: 'error',
                    backdrop: false,
                    timer: 1000,
                    // timerProgressBar: true,
                    showConfirmButton: false
                })
            }
            // .then(response => response.json())
            // .then(data => {
            //     console.log(`Task ${taskText} inserted successfully:`, data);
            // })
        } catch (error) {
            console.error("Error:", error)
        }
    });

    deleteAllBtn.addEventListener('click', () => {
        todoList.innerHTML = '';
    });

    function addTodoItem(task) {
        const todoCount = todoList.children.length + 1;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.id = 'todo-item-' + todoCount;

        todoItem.innerHTML = `
        <div class="task-number">${todoCount}</div>
        <div class="task-text">${task}</div>
        <div class="task-actions">
          <button class="complete-btn" onclick="completeTodoItem('todo-item-${todoCount}')">Complete</button>
          <button class="edit-btn" onclick="editTodoItem('todo-item-${todoCount}')">Edit</button>
          <button class="delete-btn" onclick="deleteTodoItem('todo-item-${todoCount}')">Delete</button>
        </div>
      `;

        todoList.appendChild(todoItem);
    }

    window.completeTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        const taskTextElement = todoItem.querySelector('.task-text');
        taskTextElement.classList.toggle('completed');
    };

    window.editTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        const taskTextElement = todoItem.querySelector('.task-text');

        Swal.fire({
            title: 'Edit Task',
            input: 'text',
            inputValue: taskTextElement.textContent,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            backdrop: false,
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Task cannot be empty!';
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                taskTextElement.textContent = result.value.trim();
            }
        });
    };

    window.deleteTodoItem = function (id) {
        const todoItem = document.getElementById(id);
        todoItem.remove();
        updateTaskNumbers();
    };

    function updateTaskNumbers() {
        const todoItems = todoList.querySelectorAll('.todo-item');
        todoItems.forEach((item, index) => {
            const taskNumberElement = item.querySelector('.task-number');
            taskNumberElement.textContent = index + 1;
            item.id = 'todo-item-' + (index + 1);
            item.querySelector('.complete-btn').setAttribute('onclick', `completeTodoItem('todo-item-${index + 1}')`);
            item.querySelector('.edit-btn').setAttribute('onclick', `editTodoItem('todo-item-${index + 1}')`);
            item.querySelector('.delete-btn').setAttribute('onclick', `deleteTodoItem('todo-item-${index + 1}')`);
        });
    }
});
