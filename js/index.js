const apiData = {
  members: [
    {
      id: 1,
      name: "Avudaiappan",
    },
    {
      id: 2,
      name: "Krishna",
    },
  ],
  tags: [
    {
      id: 1,
      color: "red",
      name: "High",
    },
    {
      id: 2,
      color: "yellow",
      name: "Medium",
    },
  ],
  todo: [
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
  ],
};

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
let members = [];
let tags = [];
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
  apiData.todo.push(listObject);
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
  todoList = [...JSON.parse(localStorage.getItem("data")).todo];
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
  const idx = apiData.todo.findIndex((data) => data.id === id);
  if (idx < 0) return;
  apiData.todo[idx].status = status;
  todoList[idx].status = status;
  console.log(todoList[idx]);
  setDataToLocalStorage("force");
};

const showTaskView = () => {
  const listView = document.getElementById("TABLE_VIEW");
  const taskView = document.getElementById("ADD_TASK");
  listView.classList.replace("show", "hide");
  taskView.classList.replace("hide", "show");
};

const hideTaskView = () => {
  const listView = document.getElementById("TABLE_VIEW");
  const taskView = document.getElementById("ADD_TASK");
  listView.classList.replace("hide", "show");
  taskView.classList.replace("show", "hide");
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

const toggleTagView = (action) => {
  const addTag = document.getElementById("add-tag");
  const showTag = document.getElementById("show-tag");
  const addTagButton = document.getElementById("add-tag-button");
  const showTagButton = document.getElementById("show-tag-button");
  if (action === "SHOW") {
    showTag.classList.replace("hide", "show");
    addTag.classList.replace("show", "hide");
    showTagButton.classList.remove("not-active");
    addTagButton.classList.add("not-active");
  } else {
    showTag.classList.replace("show", "hide");
    addTag.classList.replace("hide", "show");
    showTagButton.classList.add("not-active");
    addTagButton.classList.remove("not-active");
  }
};

const toggleMemberView = (action) => {
  const addMember = document.getElementById("add-member");
  const showMember = document.getElementById("show-member");
  const addMemberButton = document.getElementById("add-member-button");
  const showMemberButton = document.getElementById("show-member-button");
  if (action === "SHOW") {
    showMember.classList.add("show");
    showMember.classList.remove("hide");
    addMember.classList.remove("show");
    addMember.classList.add("hide");
    showMemberButton.classList.remove("not-active");
    addMemberButton.classList.add("not-active");
  } else {
    showMember.classList.add("hide");
    showMember.classList.remove("show");
    addMember.classList.remove("hide");
    addMember.classList.add("show");
    showMemberButton.classList.add("not-active");
    addMemberButton.classList.remove("not-active");
  }
};

const changeColor = (event) => {
  console.log(event.target.value);
  const value = event.target.value;
  const colorCard = document.getElementById("color-preview");
  colorCard.style.backgroundColor = value;
};

const switchView = (page) => {
  document.getElementById("ADD_TASK").classList.replace("show", "hide");
  const taskView = document.getElementById("TABLE_VIEW");
  const memberView = document.getElementById("MEMBER_VIEW");
  const tagView = document.getElementById("TAG_VIEW");
  switch (page) {
    case "TASK":
      taskView.classList.replace("hide", "show");
      memberView.classList.replace("show", "hide");
      tagView.classList.replace("show", "hide");
      break;
    case "MEMBER":
      memberView.classList.replace("hide", "show");
      taskView.classList.replace("show", "hide");
      tagView.classList.replace("show", "hide");
      break;
    case "TAG":
      tagView.classList.replace("hide", "show");
      taskView.classList.replace("show", "hide");
      memberView.classList.replace("show", "hide");
      break;
    default:
  }
};

const loadTags = () => {
  tags = [...JSON.parse(localStorage.getItem("data")).tags];
  const tagList = document
    .getElementById("tag-iterator")
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0];
  if (tags.length === 0) {
    tagList.insertAdjacentHTML("beforeend", "Add some tags to see here.");
    return;
  }
  tags.forEach((tag) => {
    let template = `
    <tr>
        <td><span style="background-color:{{}};"></span></td>
        <td>{{}}</td>
        <td><button>
                <?xml version="1.0" ?><svg height="24" viewBox="0 0 48 48" width="24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z" />
                    <path d="M0 0h48v48h-48z" fill="none" />
                </svg>
            </button></td>
    </tr>
`;
    template = template.replace("{{}}", tag.color);
    template = template.replace("{{}}", tag.name);
    tagList.insertAdjacentHTML("beforeEnd", template);
  });
};

const loadMembers = () => {
  members = [...JSON.parse(localStorage.getItem("data")).members];
  const membersList = document
    .getElementById("members-iterator")
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0];
  if (members.length === 0) {
    membersList.insertAdjacentHTML(
      "beforeend",
      "<p>Add some members to see here."
    );
    return;
  }
  members.forEach((member) => {
    let template = `
                                <tr>
                                    <td>{{}}</td>
                                    <td>{{}}</td>
                                    <td><button>
                                            <?xml version="1.0" ?><svg height="24" viewBox="0 0 48 48" width="24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z" />
                                                <path d="M0 0h48v48h-48z" fill="none" />
                                            </svg>
                                        </button></td>
                                </tr>
    `;
    template = template.replace("{{}}", member.id);
    template = template.replace("{{}}", member.name);
    membersList.insertAdjacentHTML("beforeend", template);
  });
};

loadTags();
loadMembers();

const addTag = (event) => {
  event.preventDefault();
  const { member_name } = event.target;
  if (!member_name.value) return;
  apiData.members.push({ id: Date.now(), name: member_name.value });
  console.log("Added Successfully!");
  setDataToLocalStorage("force");
  toggleMemberView("SHOW");
  loadMembers();
};
const deleteTag = () => {};

const addMember = (event) => {
  event.preventDefault();
  const { member_name } = event.target;
  if (!member_name.value) return;
  apiData.members.push({ id: Date.now(), name: member_name.value });
  console.log("Added Successfully!");
  setDataToLocalStorage("force");
  toggleMemberView("SHOW");
  loadMembers();
};
const deleteMember = () => {};
