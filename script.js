const taskCount = document.getElementById("taskCount");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");

let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function renderTasks() {

  taskList.innerHTML = "";

  tasks
    .filter(task => {

      if (currentFilter === "pending") {
        return !task.completed;
      }

      if (currentFilter === "completed") {
        return task.completed;
      }

      return true;
    })

    .forEach((task, index) => {

      const li = document.createElement("li");

      li.innerHTML = `
        <span class="${task.completed ? "completed" : ""}">
          ${task.text}
        </span>

        <div class="task-buttons">

          <button
            class="complete-btn"
            onclick="toggleTask(${index})">
            ✔️
          </button>

          <button
            class="edit-btn"
            onclick="editTask(${index})">
            ✏️
          </button>

          <button
            class="delete-btn"
            onclick="deleteTask(${index})">
            🗑️
          </button>

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
    text,
    completed: false
  });

  saveTasks();

  renderTasks();

  taskInput.value = "";
}

function toggleTask(index) {

  tasks[index].completed =
    !tasks[index].completed;

  saveTasks();

  renderTasks();
}

function deleteTask(index) {

  tasks.splice(index, 1);

  saveTasks();

  renderTasks();
}

function editTask(index) {

  const newTask = prompt(
    "Editar tarefa:",
    tasks[index].text
  );

  if (
    newTask !== null &&
    newTask.trim() !== ""
  ) {

    tasks[index].text =
      newTask.trim();

    saveTasks();

    renderTasks();
  }
}

function updateTaskCount() {

  const pendingTasks =
    tasks.filter(task => !task.completed).length;

  const completedTasks =
    tasks.filter(task => task.completed).length;

  taskCount.textContent =
    `${pendingTasks} pendente(s) • ${completedTasks} concluída(s)`;
}

function filterTasks(filter) {

  currentFilter = filter;

  renderTasks();

  document
    .querySelectorAll(".filters button")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  if (filter === "all") {
    document
      .querySelectorAll(".filters button")[0]
      .classList.add("active");
  }

  if (filter === "pending") {
    document
      .querySelectorAll(".filters button")[1]
      .classList.add("active");
  }

  if (filter === "completed") {
    document
      .querySelectorAll(".filters button")[2]
      .classList.add("active");
  }
}

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  const isDark =
    document.body.classList.contains("dark-mode");

  localStorage.setItem("darkMode", isDark);

  themeBtn.innerHTML =
    isDark ? "☀️" : "☾";
});

if (localStorage.getItem("darkMode") === "true") {

  document.body.classList.add("dark-mode");

  themeBtn.innerHTML = "☀️";

} else {

  themeBtn.innerHTML = "☾";
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", event => {

  if (event.key === "Enter") {

    addTask();
  }
});

renderTasks();

filterTasks("all");