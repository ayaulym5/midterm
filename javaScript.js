// для того чтобы найти элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const removeDoneTasksBtn = document.getElementById('removeDoneTasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(renderTask);
checkEmptyList();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = { id: Date.now(), text: taskText, done: false };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    taskInput.value = '';
    checkEmptyList();
});

tasksList.addEventListener('click', (e) => {
    const parentNode = e.target.closest('.list-group-item');
    if (!parentNode) return;

    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);

    if (e.target.dataset.action === 'delete') {
        tasks = tasks.filter((task) => task.id !== id);
        parentNode.remove();
    } else if (e.target.dataset.action === 'done') {
        task.done = !task.done;
        parentNode.querySelector('.task-title').classList.toggle('task-title--done');
    }

    saveTasks();
    checkEmptyList();
});

removeDoneTasksBtn.addEventListener('click', () => {
    tasks = tasks.filter((task) => !task.done);
    saveTasks();
    renderAllTasks();
    checkEmptyList();
});

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
    tasksList.insertAdjacentHTML('beforeend', `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div>
                <button data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18">
                </button>
                <button data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Delete" width="18">
                </button>
            </div>
        </li>`);
}

function renderAllTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(renderTask);
}

function checkEmptyList() {
    if (tasks.length) {
        document.querySelector('#emptyList')?.remove();
    } else if (!document.querySelector('#emptyList')) {
        tasksList.insertAdjacentHTML('afterbegin', `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div>To-Do list is empty</div>
            </li>`);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
