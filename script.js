'use strict';
const addTaskBtn = document.getElementById('add-task-btn');
const deskTaskInput = document.getElementById('description-task');
const todosWrapper = document.querySelector('.main-block__todos-wrapper');
const infoWrapper = document.querySelector('.main-block__info-wrapper');

let tasks = [];
const createTasksArray = () => {
    let local;
    if(localStorage){
        local = JSON.parse(localStorage.getItem('tasks'));
    } 
    tasks = local;
};
// let local = JSON.parse(localStorage.getItem('tasks'))
// let tasks = localStorage.tasks ?  JSON.parse(localStorage.getItem('tasks')) : [];

const ACTIVE = 0, COMPLETED = 1, ALL = 2;
let mode = ALL;

let todoItemElems = [];

class Task {
    constructor(options){
        this.description = options.description
        this.completed = options.completed
    }
}
const task = new Task  ({
    description: '',
    completed: false
});

// function Task (description) {
//     this.description = description;
//     this.completed = false;
// }

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


const changeMode = newState => {
    mode = newState;

    updateLocal();
    fillHtmlList();
};

const createSample = (task, index) => {
    return `
    <div class="main-block__todos-item ${task.completed ? 'checked' : ''} ${checkVisibility(task) ? '' : 'none'}"  >
    <div contentEditable="false" id = ${index} class="main-block__description" >${task.description}</div>
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
            <div class="score-tasks">Amount of Tasks: ${tasks.length} </div>
            <button onclick = "changeMode(ACTIVE)" class="active-task-btn" id="active-task-btn"
             >
            Show Active</button>
            <button onclick = "changeMode(COMPLETED)"
            class="completed-task-btn" id="completed-task-btn">Show Completed</button>
            <button onclick = "changeMode(ALL)" class="all-task-btn" id="all-task-btn">Show All</button>
            <button onclick = "deleteCompleted()" class="clear-completed-btn" id="clear-completed-btn">Clear Completed</button>
            <button onclick = "clearTasks()" class="clear-task-btn" id="clear-task-btn">Clear All</button>
        </div>
    `;
};

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const fillHtmlList = () => {
    todosWrapper.innerHTML = "";
    infoWrapper.innerHTML = "";
    createTasksArray();

    tasks.forEach((item, index) => {
        todosWrapper.innerHTML += createSample(item, index);
    });

    todoItemElems = document.querySelectorAll(".main-block__todos-item");

    if (tasks.length) {
        infoWrapper.innerHTML = createInfo();

        const activeBtn = document.querySelector(".active-task-btn"),
            completedBtn = document.querySelector(".completed-task-btn"),
            allBtn = document.querySelector(".all-task-btn");

        if (activeBtn && completedBtn && allBtn) {
            if (mode == ACTIVE) {
                activeBtn.classList.add("tabbed");
            } else activeBtn.classList.remove("tabbed");

            if (mode == COMPLETED) {
                completedBtn.classList.add("tabbed");
            } else completedBtn.classList.remove("tabbed");

            if (mode == ALL) allBtn.classList.add("tabbed");
            else allBtn.classList.remove("tabbed");
        }

        const edit = document.querySelectorAll(".main-block__description");
        edit.forEach((elem) => {
            elem.addEventListener("click", () => {
                elem.contentEditable = true;
            });
            elem.addEventListener("input", function (e) {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + 2 + "px";
            });
            elem.addEventListener("keydown", (but) => {
                if (but.keyCode == 13 && elem.textContent.length) {
                    let index = elem.id,
                        value = elem.innerText;
                    tasks[index].description = value;
                    elem.blur();
                    updateLocal();
                }
            });
        });
    }
};

fillHtmlList();

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;

    updateLocal();
    fillHtmlList();
};

const addTask = () => {
    tasks.push(new Task({
        description: deskTaskInput.value
    }));
    
    deskTaskInput.value = '';

    updateLocal();
    fillHtmlList();
};

deskTaskInput.oninput = () => {
    if (deskTaskInput.value.charAt(0) === " ") {
        deskTaskInput.value = "";
    }
    deskTaskInput.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && deskTaskInput.value !== "") {
            addTask();
        }
    });
};


addTaskBtn.addEventListener('click', () => {
    if (deskTaskInput.value !== '') {
        addTask();
    }
});


const deleteTask = index => {
    todoItemElems[index].classList.add('deleting');

    setTimeout( () =>{
        tasks.splice(index, 1);
        updateLocal();
        fillHtmlList();
    }, 600);
};

const deleteCompleted = () => {
    tasks = tasks.filter(elem => !elem.completed == true);

    updateLocal();
    fillHtmlList();
};

const clearTasks = () => {
    tasks = [];
    updateLocal();
    fillHtmlList();
};


// let compiled = _.template('hello <%= user %>!');
// console.log(compiled({ 'user': tasks[1].description }));

console.log(tasks[1])

var menu = new Menu({
    
    title: 'sadasd',
    // передаём также шаблоны
    template: _.template(document.getElementById('menu-template').innerHTML),

  });
  
  document.body.appendChild(menu.getElem());

  function Menu(options) {
    var elem;
  
    function getElem() {
      if (!elem) render();
      return elem;
    }
  
    function render() {
      var html = options.template({
        title: options.title
      });
  
      elem = document.createElement('div');
      elem.innerHTML = html;
      elem = elem.firstElementChild;
  
      elem.onmousedown = function() {
        return false;
      }
  
      elem.onclick = function(event) {
        if (event.target.closest('.title')) {
          toggle();
        }
      }
    }
  
    function renderItems() {
      if (elem.querySelector('ul')) return;
  
      var listHtml = options.listTemplate({
        items: options.items
      });
      elem.insertAdjacentHTML("beforeEnd", listHtml);
    }
  
    function open() {
      renderItems();
      elem.classList.add('open');
    };
  
    function close() {
      elem.classList.remove('open');
    };
  
    function toggle() {
      if (elem.classList.contains('open')) close();
      else open();
    };
  
    this.getElem = getElem;
    this.toggle = toggle;
    this.close = close;
    this.open = open;
  }