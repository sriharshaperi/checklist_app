var todoList = []; //list containing to be completed tasks
var completedList = []; //list containing completed tasks

//div element containing the form element
var form_content = document.getElementsByClassName("form_content")[0];

//div element containing status input textfield
var form_group5 = document.getElementsByClassName("form_group5")[0];

//submit button triggered when new item is to be added to list
var submit_btn = document.getElementsByClassName("submit_btn")[0];

//exit button to be triggered when form element is to be hided
var exit_btn = document.getElementsByClassName("exit_btn")[0];

//form elements
const id_title = document.getElementById("id_title");
const id_desc = document.getElementById("id_desc");
const id_duedate = document.getElementById("id_duedate");
const id_time = document.getElementById("id_time");
const id_status = document.getElementById("id_status");

//title - Completed (h4)
var completed = document.getElementById("completed");

//title - Tasks (h4)
var tasks = document.getElementById("tasks");

//putting display none for initial render
completed.style.display = "none";

//this function is triggered when a task is marked as completed
const markAsCompleted = () => {
  const isChecked = event.currentTarget.checked;
  const currentTargetValue = JSON.parse(event.currentTarget.value);
  console.log(currentTargetValue);
  const listItems = document.getElementsByClassName("listItem");
  console.log(listItems);
  const length = listItems.length;

  for (let index = 0; index < length; index++) {
    const currentItem = listItems.item(index);

    if (currentItem.textContent.trim() === currentTargetValue.title) {
      console.log(currentItem.id);
      document.getElementById(currentItem.id).style.textDecorationLine =
        isChecked ? "line-through" : "none";
      break;
    }
  }
  removeFromToDoList(currentTargetValue); // function call to remove item from todo list
  addToCompletedList(currentTargetValue); // function call to add item to completed list
};

//this function is triggered when an item is marked as incomplete from the completed list
const markAsToDo = () => {
  const isChecked = event.currentTarget.checked;
  const currentTargetValue = JSON.parse(event.currentTarget.value);
  const listItems = document.getElementsByClassName("completed_listItem");
  const length = listItems.length;

  for (let index = 0; index < length; index++) {
    const currentItem = listItems.item(index);

    if (currentItem.textContent.trim() === currentTargetValue.title) {
      console.log(currentItem.id);
      document.getElementById(currentItem.id).style.textDecorationLine =
        isChecked ? "line-through" : "none";
      break;
    }
  }
  removeFromCompletedList(currentTargetValue); // function call to remove item from completed list
  addToToDoList(currentTargetValue); // function call to add item to todo list
};

//this function is triggered for loading the data from the xhr response on initial load of document
const loadInitialList = () => {
  const ul = document.createElement("ul");
  ul.setAttribute("id", "todo_ul");
  ul.style.listStyleType = "none";
  todoList.forEach((listItem, index) => {
    const li = document.createElement("li");
    li.classList.add("listItem");
    li.setAttribute("id", `listItem-${index}`);
    const listItemStringified = JSON.stringify(listItem);
    li.innerHTML = `<span><input type="checkbox" onchange="markAsCompleted()" value='${listItemStringified}' /> ${listItem.title}</span> <button value='${listItemStringified}' onclick="showDisplay()">View</button>`;
    ul.appendChild(li);
  });
  const content_box = document.getElementById("todo_list");
  content_box.appendChild(ul);
};

//this function is triggered to display the form element for adding a new item.
const showDisplay = () => {
  form_content.style.display = "block";
  const btnValue = event.currentTarget.value;
  console.log(btnValue);

  if (btnValue === "add") {
    console.log("Add button clicked");
    submit_btn.style.display = "block";
    form_group5.style.display = "none";

    id_title.value = "";
    id_desc.value = "";
    id_duedate.value = "";
    id_time.value = "";

    id_title.removeAttribute("readonly");
    id_desc.removeAttribute("readonly");
    id_duedate.removeAttribute("readonly");
    id_time.removeAttribute("readonly");
  } else {
    const data = JSON.parse(btnValue);

    console.log("view button clicked");
    submit_btn.style.display = "none";
    form_group5.style.display = "flex";

    id_title.value = data.title;
    id_desc.value = data.description;
    id_duedate.value = data.due_date;
    id_time.value = data.time;
    id_status.value = todoList.map((list) => list.title).includes(data.title)
      ? "To Be Completed"
      : "Completed";

    id_title.setAttribute("readonly", "true");
    id_desc.setAttribute("readonly", "true");
    id_duedate.setAttribute("readonly", "true");
    id_time.setAttribute("readonly", "true");
    id_status.setAttribute("readonly", "true");
  }
};

//this function is triggered to hide the form element from the DOM on clicking hide button
const hideDisplay = () => {
  event.preventDefault();
  form_content.style.display = "none";
};

//this function is triggered to add a new item to the todolist and also for adding back incomplete items from the completed list
const addToToDoList = (listItem) => {
  console.log("entered here");
  tasks.style.display = "block";
  const ul = document.getElementById("todo_ul");
  const li = document.createElement("li");
  li.classList.add("listItem");
  li.setAttribute("id", `listItem-${todoList.length}`);
  let noNullValue;

  if (listItem) {
    console.log("it is here");

    if (!todoList.includes(listItem)) todoList.push(listItem);
    console.log(todoList);

    li.innerHTML = `<span><input type="checkbox" onchange="markAsCompleted()" value='${JSON.stringify(
      listItem
    )}' /> ${listItem.title}</span> <button value='${JSON.stringify(
      listItem
    )}' onclick="showDisplay()">View</button>`;
  } else {
    console.log("it is new");

    const title = id_title.value;
    const description = id_desc.value;
    const due_date = id_duedate.value;
    const time = id_time.value;

    noNullValue =
      title != null &&
      title.trim().length > 0 &&
      description != null &&
      description.trim().length > 0 &&
      due_date != null &&
      due_date.trim().length > 0 &&
      time != null &&
      time.trim().length > 0;

    if (noNullValue) {
      const newItem = {
        title: title,
        description: description,
        due_date: due_date,
        time: time,
      };

      console.log(newItem);
      if (!todoList.includes(newItem)) todoList.push(newItem);
      console.log(todoList);
      li.innerHTML = `<span><input type="checkbox" onchange="markAsCompleted()" value='${JSON.stringify(
        newItem
      )}' /> ${newItem.title}</span> <button value='${JSON.stringify(
        newItem
      )}' onclick="showDisplay()">View</button>`;
      form_content.style.display = "none";
    }
    id_title.value = "";
    id_desc.value = "";
    id_duedate.value = "";
    id_time.value = "";
  }

  if (listItem || noNullValue) ul.appendChild(li);
};

//this function is triggered to remove a task from the todo list
const removeFromToDoList = (listItem) => {
  todoList = todoList.filter((item) => item.title != listItem.title);
  console.log(todoList);
  if (todoList.length === 0) tasks.style.display = "none";
  const listItems = document.getElementsByClassName("listItem");

  console.log(listItems);

  let currentItem;

  for (let index = 0; index < listItems.length; index++) {
    if (
      listItems.item(index).textContent.trim().replace(" View", "") ===
      listItem.title
    ) {
      currentItem = listItems.item(index);
      break;
    }
  }

  console.log(currentItem);
  const ul = document.getElementById("todo_ul");
  if (currentItem) ul.removeChild(currentItem);
};

//this function is triggered to add a task to the completed list
const addToCompletedList = (listItem) => {
  if (!completedList.includes(listItem)) completedList.push(listItem);

  completed.style.display = "block";
  const completed_ul = document.getElementById("completed_ul");
  const li = document.createElement("li");
  const content_box = document.getElementById("content_box");

  if (completed_ul == null) {
    const ul = document.createElement("ul");
    ul.setAttribute("id", "completed_ul");
    ul.style.listStyleType = "none";
    li.classList.add("completed_listItem");
    li.setAttribute("id", `completed_listItem-${completedList.length}`);
    li.innerHTML = `<span><input type="checkbox" onchange="markAsToDo()" value='${JSON.stringify(
      listItem
    )}' /> ${listItem.title}</span> <button value='${JSON.stringify(
      listItem
    )}' onclick="showDisplay()">View</button>`;
    li.children[0].style.textDecorationLine = "line-through";
    ul.appendChild(li);
    content_box.appendChild(ul);
  } else {
    li.classList.add("completed_listItem");
    li.setAttribute("id", `completed_listItem-${completedList.length}`);
    li.innerHTML = `<span><input type="checkbox" onchange="markAsToDo()" value='${JSON.stringify(
      listItem
    )}' /> ${listItem.title}</span> <button value='${JSON.stringify(
      listItem
    )}' onclick="showDisplay()">View</button>`;
    li.children[0].style.textDecorationLine = "line-through";
    console.log(completed_ul);
    completed_ul.appendChild(li);
    content_box.appendChild(completed_ul);
  }
};

//this function is triggered to remove a task from the completed list
const removeFromCompletedList = (listItem) => {
  completedList = completedList.filter((item) => item.title != listItem.title);
  if (completedList.length === 0) completed.style.display = "none";
  const listItems = document.getElementsByClassName("completed_listItem");

  let currentItem;

  for (let index = 0; index < listItems.length; index++) {
    if (
      listItems.item(index).textContent.trim().replace(" View", "") ===
      listItem.title
    ) {
      currentItem = listItems.item(index);
      break;
    }
  }

  const ul = document.getElementById("completed_ul");
  if (currentItem) ul.removeChild(currentItem);
};

const xhr = new XMLHttpRequest(); //createing instance of XMLHttpRequest

//triggers when the load state of the data that belongs to an element or a HTML document changes
xhr.onreadystatechange = function () {
  //condition to check if the request had been sent, the server had finished returning the response and the browser had finished downloading the response content
  if (this.readyState == 4 && this.status == 200) {
    todoList = JSON.parse(xhr.responseText);
    loadInitialList();
  }
};

//xhr GET request to open a .json file
xhr.open("GET", "data/list.json");

//sending the request to the server
xhr.send();
