//LISTA DE TAREAS
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
let todos =[]; 
let EditTodoId= -1;

//Form submit
form.addEventListener("submit", function(e){
    e.preventDefault();
    console.log("submit")

    saveTodo();
    renderTodos();
})

//Guardar la tarea
function saveTodo(){
    const todoValue = todoInput.value;

    //Verificar si la tarea está vacío 
    const isEmpty= todoValue === '';

    //Verificar si la tarea está vacía 
    const isDuplicate = todos.some((todo)=> todo.value.toUpperCase() == todoValue.toUpperCase());
    if(isEmpty){
        alert ('El campo está vacío');
    }else if(isDuplicate){
        alert ('La tarea está repetida')
    }else{
        if(EditTodoId >= 0){
            todos = todos.map((todo,index) =>({
                ...todo,
                value: index=== EditTodoId ? todoValue : todo.value,                
            }));
            EditTodoId = -1;
        }else{
            todos.push({
                value: todoValue,
                checked: false,
                color: '#' + Math.floor(Math.random()*16777215).toString(16),
            });
        }
        
        todoInput.value= ""
    }
    
}

//RENDER TO DO 
function renderTodos(){
    //CLEAR ELEMENT BEFORE RENDER
    todosListEl.innerHTML= "";

    //RENDER TODOS
    todos.forEach((todo,index) =>{
        todosListEl.innerHTML += `
        <div class="todo" id=${index}>
                <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}""
                style = "color : ${todo.color}"
                data-action="check"
                ></i>
                <p class="" data-action="check">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash" data-action="delete"></i>
            </div>`
    })
}

//Click Event Listener
todosListEl.addEventListener("click", (event) => {
    const target = event.target;
    const parentElement = target.parentNode;

    if(parentElement.className !== "todo")return;

    //todo id
    const todo= parentElement;
    const todoId= Number(todo.id);

    //target action
    const action= target.dataset.action;

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId); 

})

//Tildar la tarea
function checkTodo(todoId) {
    todos = todos.map((todo, index) => ({
        ...todo,
        checked: index === todoId ? !todo.checked : todo.checked,
    }));

    renderTodos();
}

//Editar la tarea
function editTodo(todoId){
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;
}

//Borrar la tarea
function deleteTodo(todoId){
    todos = todos.filter( (todo,index) => index !== todoId);
    EditTodoId = -1;

    //re-render
    renderTodos();
}

//Toastify 
const btn = document.querySelector("#btn_tarea");
btn.addEventListener('click', () => {   
    Toastify({
        text: "Tarea agregada",
        duration: 3000,
        gravity: "top",
        position:"right",
        style: {
            background: "#add8e6"
        }
    }).showToast();
})

//TEMPORIZADOR
const workBtn = document.getElementById("work-btn");
const shortBreakkBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");
let timeDisplay = document.querySelector("#time-display");
let timeout;

workBtn.addEventListener("click",() => {startTimer(25 * 60)});
shortBreakkBtn.addEventListener("click",() => {startTimer(5 * 60)});
longBreakBtn.addEventListener("click",() => {startTimer(15 * 60)});


//Empezar el temporizador
function startTimer(time) {
    if( typeof timeout !== undefined){
        clearInterval(timeout);
    }

    let allowTime = time;
    showTime(allowTime);

    timeout = setInterval(() => {
        if (allowTime == 0){
            clearInterval(timeout);
            showTime(0)
        }else{
            allowTime -- ;
            showTime(allowTime);
        }
    }, 1000);
}

function showTime(allowTime){
    let minutes = pad(Math.floor(allowTime / 60));
    let seconds =pad(allowTime % 60) ;

    let time = `${minutes}:${seconds}`;
    document.title = time;
    timeDisplay.innerText= time;
}

function pad(number){
    return number < 10  ? `0${number.toString()}`: number
}

//BOARD
const button = document.querySelector("#board_btn");
const containers = document.querySelectorAll(".container");

button.addEventListener("click", function (e) {
    //Crear el campo para escribir la tarea
    const textarea = document.createElement("textarea");
    //Hacerlo movible
    textarea.draggable = true;
    //ID
    textarea.id = Math.random() * 100;

    textarea.addEventListener("dragstart", onDragStart);
    textarea.addEventListener("dragend", onDragEnd);
    const first = document.querySelector("#first");
    first.appendChild(textarea);
});

function onDragEnd(e) {
    e.target.classList.remove("drag");
}

function onDragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
    e.target.classList.add("drag");
}
//Iterar contenedores para que se puedan mover
containers.forEach((container) => {
    container.addEventListener("dragover", function (e) {
    e.preventDefault();
    });
});

//Iterar contenedores para que sean dropeables
containers.forEach((container) => {
    container.addEventListener("drop", function (e) {
    e.preventDefault();
    const textareaID = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(textareaID));
    });
});


