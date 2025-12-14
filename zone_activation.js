//Globale vairabler

let scenario = null;
let tasks = [];
let currentTaskIndex = 0;
let activeTask = null;

let userPosition = {
  lat: 56.12,
  lng: 9.12
};

//Indlæs scenarie og initialiser opgaver

async function loadMission() {
  const response = await fetch("data.json");
  mission = await response.json();

  tasks = mission.tasks.sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  renderTaskList();
  activateNextTask();
}

//aktiver næste opgave

function activateNextTask() {
  if (currentTaskIndex >= tasks.length) {
    alert("Alle missioner er fuldført");
    return;
  }

  activeTask = tasks[currentTaskIndex];
  activeTask.isActive = true;
  activeTask.popupShown = false;

  drawTaskZone(activeTask);
  updateTaskListUI();
}

//Tegn opgavezone på kortet (her simuleret med et div-element)

function drawTaskZone(task) {
  const map = document.getElementById("map");

  const zone = document.createElement("div");
  zone.classList.add("zone");
  zone.dataset.taskId = task.taskId;

  map.appendChild(zone);
}

//Overvåg brugerens position og tjek for zoneaktivering

function updateUserPosition(lat, lng) {
  userPosition.lat = lat;
  userPosition.lng = lng;

  checkTaskZone();
}

//Tjek om brugeren er inden for den aktive opgaves zone

function checkTaskZone() {
  if (!activeTask || activeTask.popupShown) return;

  const distance = calculateDistance(
    userPosition.lat,
    userPosition.lng,
    activeTask.mapLat,
    activeTask.mapLng
  );

  if (distance <= activeTask.mapRadiusInMeters) {
    showPopup(activeTask);
    activeTask.popupShown = true;
  }
}

//Afstandsfunktion (simpel, go nok til øvelse)

function calculateDistance(lat1, lng1, lat2, lng2) {
  const dx = lat1 - lat2;
  const dy = lng1 - lng2;

  return Math.sqrt(dx * dx + dy * dy) * 111000;
}

//Popup med data fra JSON

function showPopup(task) {
  document.getElementById("popupTitle").textContent =
    "Mission " + task.orderNumber;

  document.getElementById("popupDescription").textContent =
    task.taskDescription;

  const optionsContainer = document.getElementById("popupOptions");
  optionsContainer.innerHTML = "";

  task.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option.optionText;
    btn.onclick = () => handleOption(option);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("popup").classList.remove("hidden");
}

//Håndtering af valgmuligheder i popup

function handleOption(option) {
  if (option.isCorrect) {
    completeTask();
  } else {
    alert("Forkert valg – prøv igen");
  }
}

//Luk popup

document.getElementById("closePopupBtn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

//Fuldfør opgave og aktiver næste

function completeTask() {
  activeTask.isActive = false;
  activeTask.isCompleted = true;

  removeTaskZone(activeTask);
  document.getElementById("popup").classList.add("hidden");

  currentTaskIndex++;
  activeTask = null;

  activateNextTask();
}

//Fjern opgavezone fra kortet

function removeTaskZone(task) {
  const zone = document.querySelector(
    `[data-task-id="${task.taskId}"]`
  );

  if (zone) zone.remove();
}

//Opgaveliste UI

function renderTaskList() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.id = `task-${task.taskId}`;
    li.textContent = `Mission ${task.orderNumber}: ${task.taskTitle}`;
    list.appendChild(li);
  });
}

function updateTaskListUI() {
  tasks.forEach(task => {
    const li = document.getElementById(`task-${task.taskId}`);
    if (!li) return;

    if (task.isCompleted) li.className = "completed";
    else if (task.isActive) li.className = "active";
  });
}

loadScenario();