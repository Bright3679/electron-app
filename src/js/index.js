document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText) {
            addTodoItem(taskText);
            todoInput.value = '';
        }
    });

    deleteAllBtn.addEventListener('click', () => {
        todoList.innerHTML = '';
    });

    function addTodoItem(text) {
        const todoCount = todoList.children.length + 1;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.id = 'todo-item-' + todoCount;

        todoItem.innerHTML = `
        <div class="task-number">${todoCount}</div>
        <div class="task-text">${text}</div>
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
