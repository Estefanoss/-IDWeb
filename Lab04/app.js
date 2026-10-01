// app.js - Módulo de Gestión
const form = document.querySelector('#todo-form');
const inputTitulo = document.querySelector('#todo-titulo');
const inputCurso = document.querySelector('#todo-curso');
const inputFecha = document.querySelector('#todo-fecha');
const list = document.querySelector('#todo-list');
const alertContainer = document.querySelector('#alert-container');
const filterButtons = document.querySelector('#filter-buttons');

let tasks = JSON.parse(localStorage.getItem('academic_tasks')) || [];
let currentFilter = 'todas';


function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}


function validateForm(titulo, curso, fecha) {
    if (!titulo || !curso || !fecha) {
        showAlert('Por favor, complete todos los campos del formulario.');
        return false;
    }

    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada <= hoy) {
        showAlert('La fecha de entrega debe ser posterior a la fecha actual.');
        return false;
    }

    return true;
}

function syncLocalStorage() {
    localStorage.setItem('academic_tasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
    if (currentFilter === 'pendientes') {
        return tasks.filter(task => !task.completada);
    }
    if (currentFilter === 'completadas') {
        return tasks.filter(task => task.completada);
    }
    return tasks; 
}

function renderTasks() {
    list.innerHTML = '';
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        list.innerHTML = `
            <li class="list-group-item text-center text-muted py-3">
                No hay tareas disponibles en este filtro.
            </li>
        `;
        return;
    }

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completada ? 'bg-light' : ''}`;

        const titleStyle = task.completada 
            ? 'text-decoration-line-through text-muted' 
            : 'fw-bold text-dark';

        li.innerHTML = `
            <div>
                <div class="${titleStyle} fs-5">${task.titulo}</div>
                <small class="text-secondary">
                    <strong>Curso:</strong> ${task.curso} | <strong>Entrega:</strong> ${task.fechaEntrega}
                </small>
            </div>
            <div>
                <button class="btn btn-sm ${task.completada ? 'btn-warning' : 'btn-success'} me-2" onclick="toggleTask(${task.id})">
                    ${task.completada ? 'Desmarcar' : 'Completar'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                    Eliminar
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const curso = inputCurso.value.trim();
    const fechaEntrega = inputFecha.value;

    if (!validateForm(titulo, curso, fechaEntrega)) return;

    const newTask = {
        id: Date.now(), 
        titulo,
        curso,
        fechaEntrega,
        completada: false
    };

    tasks.push(newTask);
    syncLocalStorage();
    renderTasks();

    form.reset();
    alertContainer.innerHTML = ''; 
    showAlert('Tarea registrada con éxito.', 'success');
});

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completada = !task.completada;
        syncLocalStorage();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    syncLocalStorage();
    renderTasks();
}

filterButtons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        Array.from(filterButtons.children).forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }
});
document.addEventListener('DOMContentLoaded', renderTasks);
