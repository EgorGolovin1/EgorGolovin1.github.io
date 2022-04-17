'use strict';
const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.main-block__todos-wrapper');
const infoWrapper = document.querySelector('.main-block__info-wrapper');

let tasks = localStorage.tasks ?  JSON.parse(localStorage.getItem('tasks')) : [];

let todoItemElems = [];
let todoItemElemsInfo = [];

function Task (description) {
    this.description = description;
    this.completed = false;
}


const createSample = (task, index) => {
    return `
    <div class="main-block__todos-item ${task.completed ? 'checked' : ''} ${task.isInvisible ? 'none' : ''}" >
    <div class="main-block__discription">${task.description}</div>
    <div class="main-block__buttons">
        <input onclick = "completeTask(${index})" type="checkbox" class="main-block__btn-complete"
         ${task.completed ? 'checked' : ''}>
        <buttons onclick = "deleteTask(${index})" class="main-block__btn-delete"></buttons>
        </div>
    </div>
    `;
};
const createInfo = () => {
    return `
    <div class="main-block__info-items">
            <div class="score-tasks">Number of Tasks: ${tasks.length} </div>
            <button onclick = "filterTasks(true)" class="active-task-btn" id="active-task-btn" >
            Show Active</button>
            <button  onclick = "filterTasks(false)"
            class="completed-task-btn" id="completed-task-btn">Show Completed</button>
            <button onclick = "allTasks(false)" class="all-task-btn" id="all-task-btn">Show All</button>
        </div>
    `;
};

const fillHtmlList = () => {
    todosWrapper.innerHTML = "";
    infoWrapper.innerHTML = "";
    
    tasks.forEach((item, index) => {
        todosWrapper.innerHTML += createSample(item, index);
    });
    
    todoItemElems = document.querySelectorAll('.main-block__todos-item');
    
    if(tasks.length){
        infoWrapper.innerHTML = createInfo();
    }

    todoItemElemsInfo = document.querySelectorAll('.info-items');
};

fillHtmlList();

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    if(tasks[index].completed ){
        todoItemElems[index].classList.add('checked');
    } else {
        todoItemElems[index].classList.remove('checked');
    }
    updateLocal();
    fillHtmlList();
};


addTaskBtn.addEventListener('click', () => {
    if(deskTaskInput.value !== ''){
    tasks.push(new Task(deskTaskInput.value));
    updateLocal();
    fillHtmlList();
    deskTaskInput.value = '';}
});

deskTaskInput.addEventListener('keydown', function(e)  {
    if (e.keyCode === 13 && deskTaskInput.value !== ''){
    tasks.push(new Task(deskTaskInput.value));
    updateLocal();
    fillHtmlList();
    deskTaskInput.value = '';}
});


const deleteTask = index => {
    todoItemElems[index].classList.add('deleting');
    setTimeout( () =>{tasks.splice(index, 1);
        updateLocal();
        fillHtmlList();}, 600);
};

const filterTasks = active => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].isInvisible = active ^ !tasks[i].completed ;
    }

    updateLocal();
    fillHtmlList();
};

const allTasks = () => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].isInvisible = false ;
    }

    updateLocal();
    fillHtmlList();
};