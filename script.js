// ==========================================
// TASKFLOW - TO-DO LIST APPLICATION
// ==========================================


// ------------------------------------------
// 1. DOM ELEMENTS
// ------------------------------------------

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");


// ------------------------------------------
// 2. APPLICATION STATE
// ------------------------------------------

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ------------------------------------------
// 3. SAVE TASKS TO LOCAL STORAGE
// ------------------------------------------

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ------------------------------------------
// 4. CREATE NEW TASK
// ------------------------------------------

function addTask() {

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };

    // Add task to state
    tasks.push(newTask);

    // Save to localStorage
    saveTasks();

    // Clear input
    taskInput.value = "";

    // Update UI
    renderTasks();

}


// ------------------------------------------
// 5. RENDER TASKS
// ------------------------------------------

function renderTasks() {

    // Clear existing list
    taskList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }


    // Create task elements
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <div class="task-actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(li);

    });


    updateTaskCount();

    updateEmptyMessage();

}


// ------------------------------------------
// 6. UPDATE TASK COUNT
// ------------------------------------------

function updateTaskCount() {

    const activeTasks = tasks.filter(
        task => !task.completed
    ).length;


    if (activeTasks === 1) {

        taskCount.textContent = "1 task remaining";

    }

    else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;

    }

}


// ------------------------------------------
// 7. EMPTY MESSAGE
// ------------------------------------------

function updateEmptyMessage() {

    const visibleTasks = getFilteredTasks();

    if (visibleTasks.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }

}


// ------------------------------------------
// 8. GET FILTERED TASKS
// ------------------------------------------

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        return tasks.filter(task => task.completed);

    }

    return tasks;

}


// ------------------------------------------
// 9. TOGGLE TASK
// ------------------------------------------

function toggleTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

}


// ------------------------------------------
// 10. DELETE TASK
// ------------------------------------------

function deleteTask(taskId) {

    tasks = tasks.filter(
        task => task.id !== taskId
    );

    saveTasks();

    renderTasks();

}


// ------------------------------------------
// 11. EDIT TASK
// ------------------------------------------

function editTask(taskId) {

    const task = tasks.find(
        task => task.id === taskId
    );

    if (!task) return;


    const newText = prompt(
        "Edit your task:",
        task.text
    );


    if (newText === null) {

        return;

    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    task.text = updatedText;

    saveTasks();

    renderTasks();

}


// ------------------------------------------
// 12. CLEAR COMPLETED TASKS
// ------------------------------------------

function clearCompleted() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();

}


// ------------------------------------------
// 13. EVENT DELEGATION
// ------------------------------------------

taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) return;


    const taskId = Number(taskItem.dataset.id);


    // Delete button
    if (event.target.classList.contains("delete-btn")) {

        deleteTask(taskId);

    }


    // Edit button
    else if (event.target.classList.contains("edit-btn")) {

        editTask(taskId);

    }

});


// ------------------------------------------
// 14. CHECKBOX EVENT
// ------------------------------------------

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("task-checkbox")) {

        return;

    }


    const taskItem = event.target.closest(".task-item");

    const taskId = Number(taskItem.dataset.id);

    toggleTask(taskId);

});


// ------------------------------------------
// 15. FILTER BUTTONS
// ------------------------------------------

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        // Remove active class
        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        // Add active class
        this.classList.add("active");


        // Update filter
        currentFilter = this.dataset.filter;


        // Re-render
        renderTasks();

    });

});


// ------------------------------------------
// 16. ADD BUTTON
// ------------------------------------------

addTaskBtn.addEventListener("click", addTask);


// ------------------------------------------
// 17. ENTER KEY
// ------------------------------------------

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ------------------------------------------
// 18. CLEAR COMPLETED BUTTON
// ------------------------------------------

clearCompletedBtn.addEventListener(
    "click",
    clearCompleted
);


// ------------------------------------------
// 19. ESCAPE HTML
// ------------------------------------------
// Prevent HTML injection when displaying task text.

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ------------------------------------------
// 20. INITIAL RENDER
// ------------------------------------------

renderTasks();
