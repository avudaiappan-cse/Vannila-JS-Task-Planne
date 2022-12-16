const apiData = [
  {
    id: "1",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "TODO",
  },
  {
    id: "2",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "COMPLETED",
  },
  {
    id: "4",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "TODO",
  },
  {
    id: "5",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "COMPLETED",
  },
  {
    id: "6",
    title: "Do some work",
    reporter: "Avudaiappan",
    assignee: "Avudaiappan",
    status: "IN_PROGRESS",
  },
];

const setDataToLocalStorage = (params) => {
  if (localStorage.getItem("data") && params !== "force") {
    return;
  }
  localStorage.setItem("data", JSON.stringify(apiData));
};

// const loadProgressor = () => {
//   const progressor = document.getElementById("progressor");
//   progressor.style.height = "10px";
//   progressor.style.backgroundColor = "yellowgreen";
//   progressor.style.width = 0;
//   let width = 0;
//   const interval = setInterval(() => {
//     width += 10;
//     progressor.style.width = `${width}%`;
//     if (width === 100) clearInterval(interval);
//   }, 75);
// };

// loadProgressor();

let todoList = [];
const todoContainer = document.getElementById("todo");
const progressContainer = document.getElementById("progress");
const completedContainer = document.getElementById("completed");

const taskObject = {
  title: "",
  description: "",
  reporter: "",
  assignee: "",
  status: "",
};

const changeHandler = (prop) => {
  taskObject[prop] = document.getElementById(prop).value;
};

const submit = () => {
  for (const value of Object.values(taskObject)) {
    if (value === "") return;
  }
  const listObject = { ...taskObject, id: Date.now() };
  apiData.push(listObject);
  setDataToLocalStorage("force");
  loadData();
  hideTaskView();
};

const trackNoListStatus = () => {
  console.log(isSomeTask("TODO"));
  if (isSomeTask("TODO")) {
    document.getElementById("todo-no-list").setAttribute("hidden", true);
  } else {
    document.getElementById("todo-no-list").removeAttribute("hidden");
  }

  if (isSomeTask("IN_PROGRESS")) {
    document.getElementById("progress-no-list").setAttribute("hidden", true);
  } else {
    document.getElementById("progress-no-list").removeAttribute("hidden");
  }

  if (isSomeTask("COMPLETED")) {
    document.getElementById("completed-no-list").setAttribute("hidden", true);
  } else {
    document.getElementById("completed-no-list").removeAttribute("hidden");
  }
};

const isSomeTask = (status) => {
  return todoList.some((item) => item.status === status);
};

const resetContainer = () => {
  console.log("Called!");
  todoContainer.getElementsByClassName(
    "table-list"
  )[0].innerHTML = `<p class="no-list" id="todo-no-list">Add some task to see here</p>`;
  progressContainer.getElementsByClassName(
    "table-list"
  )[0].innerHTML = `<p class="no-list" id="progress-no-list">Add some task to see here</p>`;
  completedContainer.getElementsByClassName(
    "table-list"
  )[0].innerHTML = `<p class="no-list" id="completed-no-list">Add some task to see here</p>`;
};

const loadData = () => {
  resetContainer();
  todoList = [...JSON.parse(localStorage.getItem("data"))];
  todoList.forEach((item) => {
    let content = `
        <div class="task-card {{}}" id="{{}}" draggable="true" ondragstart="move(event)">
            <h4>{{}}</h4>
            <br />
            <p>Assignee: {{}}</p>
            <p>Reporter: {{}}</p>
        </div>`;
    content = content.replace("{{}}", item.status);
    content = content.replace("{{}}", item.id);
    content = content.replace("{{}}", item.title);
    content = content.replace("{{}}", item.assignee);
    content = content.replace("{{}}", item.reporter);
    if (item.status === "TODO") {
      todoContainer.getElementsByClassName("table-list")[0].innerHTML +=
        content;
    } else if (item.status === "IN_PROGRESS") {
      progressContainer.getElementsByClassName("table-list")[0].innerHTML +=
        content;
    } else if (item.status === "COMPLETED") {
      completedContainer.getElementsByClassName("table-list")[0].innerHTML +=
        content;
    }
  });
  trackNoListStatus();
};

setDataToLocalStorage();
loadData();

const updateStatus = (id, status) => {
  const idx = apiData.findIndex((data) => data.id === id);
  if (idx < 0) return;
  apiData[idx].status = status;
  todoList[idx].status = status;
  console.log(todoList[idx]);
  setDataToLocalStorage();
};

const showTaskView = () => {
  const listView = document.getElementById("TABLE_VIEW");
  const taskButton = document.getElementById("add-task-button");
  const taskView = document.getElementById("ADD_TASK");
  taskButton.style.display = "none";
  listView.style.display = "none";
  taskView.style.display = "inherit";
};

const hideTaskView = () => {
  const listView = document.getElementById("TABLE_VIEW");
  const taskButton = document.getElementById("add-task-button");
  const taskView = document.getElementById("ADD_TASK");
  taskButton.style.display = "";
  listView.style.display = "inherit";
  taskView.style.display = "none";
};

const move = (event) => {
  event.dataTransfer.setData("id", event.target.id);
  event.dataTransfer.dropEffect = "move";
};

const allowDrop = (event) => {
  event.preventDefault();
};
const drop = (event, status) => {
  console.log(status);
  console.log(
    event.toElement.className,
    event.toElement.parentElement.className
  );
  if (
    event.toElement.className.includes("task-card") ||
    event.toElement.parentElement.className.includes("task-card")
  ) {
    return;
  }
  console.log(event.dataTransfer.getData("id"));
  const id = event.dataTransfer.getData("id");
  event.target.appendChild(document.getElementById(id));
  updateStatus(id, status);
  document.getElementById(id).classList.replace("COMPLETED", status);
  document.getElementById(id).classList.replace("IN_PROGRESS", status);
  document.getElementById(id).classList.replace("TODO", status);
  trackNoListStatus();
};
