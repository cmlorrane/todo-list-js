const taskCount = document.getElementById("taskCount");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");

let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks
  .filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  })
  .forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">
        ${task.text}
      </span>

      <div>
       <button onclick="toggleTask(${index})">✔</button>
       <button onclick="editTask(${index})">✏</button>
       <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
  
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

renderTasks();

taskInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function updateTaskCount() {
  const pendingTasks = tasks.filter(task => !task.completed).length;

  taskCount.textContent = `${pendingTasks} tarefa(s) pendente(s)`;
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

function editTask(index) {
  const newTask = prompt("Editar tarefa:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask;

    saveTasks();
    renderTasks();
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}