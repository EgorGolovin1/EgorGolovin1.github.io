'use strict';
const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.main-block__todos-wrapper');
const infoWrapper = document.querySelector('.main-block__info-wrapper');

let tasks = [];
let localEvidence = () => {
    let local;
    let localMode;
    if(localStorage){
        local = JSON.parse(localStorage.getItem('tasks'));
        localMode = JSON.parse(localStorage.getItem('mode'));
    } 
    tasks = local;
    mode = localMode;
};

const ACTIVE = 0, COMPLETED = 1, ALL = 2;
let mode = ALL;

class Task {
    constructor(options){
        this.description = options.description;
        this.completed = false;
    }
}

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('mode', JSON.stringify(mode));
};

const addTask = () => {tasks.push(new Task({description: deskTaskInput.value}));
    deskTaskInput.value = '';
    updateLocal();
    fillHtmlList();
};

deskTaskInput.oninput = () => {
    if (deskTaskInput.value.charAt(0) === " ") deskTaskInput.value = "";
    deskTaskInput.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && deskTaskInput.value !== "") addTask();
    });
};

addTaskBtn.addEventListener('click', () => { if (deskTaskInput.value !== '') addTask();});

const fillHtmlList = () => {
    todosWrapper.innerHTML = "";
    infoWrapper.innerHTML = "";
    localEvidence();

    tasks.forEach((item, index) => {
        let sample = new Sample({
            title: item.description,
            completed: item.completed,
            index: index,
            template: _.template(document.getElementById('sample-template').innerHTML),
        });
        todosWrapper.prepend(sample.getElem());
    });

    if (tasks.length){
        let infoSample = new Info({
            amount: tasks.length,
            infoTemplate: _.template(document.getElementById('info-template').innerHTML)
        });
        infoWrapper.appendChild(infoSample.getInfo());
    }
};

function Sample(options) {
    let elem;
    
    function getElem() {
        if (!elem) {render();}
        return elem;
    }
    const completeTask = index => {
        tasks[index].completed = !tasks[index].completed;
        updateLocal();
        fillHtmlList();
    };

    const deleteTask = index => {    
        setTimeout( () =>{
            tasks.splice(index, 1);
            updateLocal();
            fillHtmlList();
        }, 600);
    };

    function render() {
        let html = options.template({
            title: options.title,
            completed: options.completed,
            index: options.index
        });
    
        elem = document.createElement('div');
        elem.innerHTML = html;
        
        let check = elem.querySelector('.main-block__btn-complete'),
            todoItem = elem.querySelector('.main-block__todos-item'),
            delBtn = elem.querySelector('.main-block__btn-delete'),
            descrItem = elem.querySelector('.main-block__description');

        check.addEventListener('click', () => {
            completeTask(options.index);
        });
        
        const checkVisibility = task => {
            switch (mode) {
                case ACTIVE:
                    return !task.completed;
                case COMPLETED:
                    return task.completed;
                default:
                    return true;
            }
        };

        checkVisibility(mode); 
        if(mode == ACTIVE && tasks[options.index].completed ) todoItem.classList.add('none');
        if(mode == ACTIVE && !tasks[options.index].completed ) todoItem.classList.remove('none');
        if(mode == COMPLETED && !tasks[options.index].completed ) todoItem.classList.add('none');
        if(mode == COMPLETED && tasks[options.index].completed ) todoItem.classList.remove('none');
        if(mode == ALL) todoItem.classList.remove('none');

        if(options.completed == true){
            todoItem.classList.add('checked');
            check.checked = true;
        }

        delBtn.addEventListener('click', () => {
            deleteTask(options.index);
            todoItem.classList.add('deleting');
        });

        descrItem.addEventListener("click", () => {
            descrItem.contentEditable = true;
        });

        descrItem.addEventListener("input", function (e) {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + 2 + "px";
        });
        
        descrItem.addEventListener("keydown", (but) => {
            if (but.keyCode == 13 && descrItem.textContent.length) {
                let value = descrItem.innerText;
                    options.title = value;
                    tasks[options.index].description = value;
                descrItem.blur();
                updateLocal();
            }

        });
    }
    updateLocal();
    this.getElem = getElem;
}

function Info (attributes){
    let information;

    function getInfo() {
        if(!information) {renderItems();}
        return information;
    }
    
    const changeMode = newState => {
        mode = newState;
        updateLocal();
        fillHtmlList();
    };

    function renderItems() {
            let listHtml = attributes.infoTemplate({
                amount: tasks.length,
            });
        information = document.createElement('div');
        information.innerHTML = listHtml;

        let showActive = information.querySelector('.active-task-btn'),
            showCompleted = information.querySelector('.completed-task-btn'),
            showAll = information.querySelector('.all-task-btn'),
            clearCompleted = information.querySelector('.clear-completed-btn'),
            clearAll = information.querySelector('.clear-task-btn');

            showActive.addEventListener('click', () => {
                changeMode(ACTIVE);
            });

            showCompleted.addEventListener('click', () => {
                changeMode(COMPLETED);
            });

            showAll.addEventListener('click', () => {
                changeMode(ALL);
            });

            if (mode == ACTIVE) showActive.classList.add("tabbed");
            else showActive.classList.remove("tabbed");

            if (mode == COMPLETED) showCompleted.classList.add("tabbed");
            else showCompleted.classList.remove("tabbed");

            if (mode == ALL) showAll.classList.add("tabbed");
            else showAll.classList.remove("tabbed");

            clearCompleted.addEventListener('click', () => {
                tasks = tasks.filter(elem => !elem.completed == true);
                updateLocal();
                fillHtmlList();
            });
            
            clearAll.addEventListener('click', () => {
                tasks = [];
                updateLocal();
                fillHtmlList();
            })
      }
    this.getInfo =  getInfo;
}

fillHtmlList();


