let map = L.map("map").setView([56.123, 9.123], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

//globale variabler

let scenario;
let tasks = [];
let currentTaskIndex = 0;
let activeTask = null;

let activeZone = null;
let activeMarker = null;

let userMarker = L.marker([56.12, 9.12]).addTo(map);

//Indlæs scenarie og initialiser opgaver

async function loadScenario() {
  const response = await fetch("scenario.json");
  scenario = await response.json();

  tasks = scenario.tasks.sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  renderTaskList();
  activateNextTask();
}

//aktiver næste opgave

function activateNextTask() {
  if (currentTaskIndex >= tasks.length) {
    alert("Alle missioner fuldført");
    return;
  }

  activeTask = tasks[currentTaskIndex];
  activeTask.isActive = true;
  activeTask.popupShown = false;

  drawTaskOnMap(activeTask);
  updateTaskListUI();
}

//Tegn zone + centerpunkt på kortet

function drawTaskOnMap(task) {
  if (activeZone) map.removeLayer(activeZone);
  if (activeMarker) map.removeLayer(activeMarker);

  activeZone = L.circle(
    [task.mapLat, task.mapLng],
    {
      radius: task.mapRadiusInMeters,
      color: "#3b82f6",
      fillColor: "#3b82f6",
      fillOpacity: 0.2
    }
  ).addTo(map);

  activeMarker = L.marker(
    [task.mapLat, task.mapLng]
  ).addTo(map);
}

//Simuler bevægelse

map.on("click", e => {
  updateUserPosition(e.latlng.lat, e.latlng.lng);
});

function updateUserPosition(lat, lng) {
  userMarker.setLatLng([lat, lng]);
  checkTaskZone();
}

//Tjek zone (Leaflet distancefunktion)

function checkTaskZone() {
  if (!activeTask || activeTask.popupShown) return;

  const userLatLng = userMarker.getLatLng();
  const taskLatLng = L.latLng(
    activeTask.mapLat,
    activeTask.mapLng
  );

  const distance = userLatLng.distanceTo(taskLatLng);

  if (distance <= activeTask.mapRadiusInMeters) {
    showPopup(activeTask);
    activeTask.popupShown = true;
  }
}

//Popup visning

function showPopup(task) {
  document.getElementById("popupTitle").textContent =
    "Mission " + task.orderNumber;

  document.getElementById("popupDescription").textContent =
    task.taskDescription;

  const options = document.getElementById("popupOptions");
  options.innerHTML = "";

  task.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option.optionText;
    btn.onclick = () => handleOption(option);
    options.appendChild(btn);
  });

  document.getElementById("popup").classList.remove("hidden");
}

//Option og fuldførelse

function handleOption(option) {
  if (option.isCorrect) {
    completeTask();
  } else {
    alert("Forkert valg – prøv igen");
  }
}

function completeTask() {
  activeTask.isCompleted = true;
  activeTask.isActive = false;

  document.getElementById("popup").classList.add("hidden");

  currentTaskIndex++;
  activeTask = null;

  activateNextTask();
}

//Taskliste

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

    li.className = task.isCompleted
      ? "completed"
      : task.isActive
      ? "active"
      : "";
  });
}

//Start app

loadScenario();