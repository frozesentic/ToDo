const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");
    const iconInput = document.getElementById("iconInput");
const addTaskIcon = document.getElementById("addTaskIcon");
const wallpaperInput = document.getElementById("wallpaper");
const refreshWallpaperButton = document.getElementById("refreshWallpaper");

// Load wallpaper on page load
const savedWallpaper = localStorage.getItem("wallpaper");
if (savedWallpaper) {
    setWallpaper(savedWallpaper);
} else {
    setWallpaper('bg.png'); // Default wallpaper path
}

// Listen for changes in the wallpaper input
wallpaperInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const wallpaperPath = e.target.result;
            setWallpaper(wallpaperPath);
            localStorage.setItem("wallpaper", wallpaperPath); // Save wallpaper path to local storage
        };
        reader.readAsDataURL(file);
    }
});

// Function to set the wallpaper
function setWallpaper(imagePath) {
    document.body.style.backgroundImage = `url('${imagePath}')`;
}

// Listen for click event on the refresh wallpaper button
refreshWallpaperButton.addEventListener("click", function () {
    localStorage.removeItem("wallpaper"); // Remove saved wallpaper path from local storage
    setWallpaper('bg.png'); // Reset back to the default wallpaper
});

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            let dueDateDisplay = todo.dueDate ? `<span class="due-date">(${todo.dueDate})</span>` : "";
            if (filter === todo.status || filter === "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="task-name ${completed}">${todo.name}</p> ${dueDateDisplay}
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }

    taskBox.innerHTML = liTag ? liTag : `<div class="center-content"><span>You don't have any task here</span></div>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");    
}
showTodo("all");

//i have added a task before tutorial so that shows here for test
// if you don't have any tasks no problem it isn't bug

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.querySelector('.task-name');
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

// Event listener for adding tasks and due dates using Enter key
document.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        if (document.activeElement === dueDateInput || document.activeElement === taskInput) {
            addTask();
        }
    }
});

function addTask() {
    let userTask = taskInput.value.trim();
    let dueDate = dueDateInput.value;
    if (userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending", dueDate: dueDate };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].dueDate = dueDate;
        }
        taskInput.value = "";
        dueDateInput.value = ""; // Clear the due date input
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
}