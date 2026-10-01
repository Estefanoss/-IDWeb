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

function renderTasks() {
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>${task.text}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Eliminar</button>
        `;
        list.appendChild(li);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    input.value = '';
    renderTasks();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

document.addEventListener('DOMContentLoaded', renderTasks);
