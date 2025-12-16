import { receiveScenario } from "./missionList.js";
import { receiveTaskActivated } from "./missionList.js";

/* leaflet & openstreetmap */
let map = L.map("map");
map.setView([56.123, 9.123], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

//globale variabler

let tasks = [];
let currentTaskIndex = 0;
let activeTask = null;
let activeZone = null;

const locationMarker = L.icon({
  iconUrl: "assets/locationMarker.svg",

  iconSize: [30, 25],
});
const userMarker = L.marker([56.12, 9.12], { icon: locationMarker }).addTo(map);

// Forslag til Geo-lokation og tracking:
/* if (navigator.geolocation){
    navigator.geolocation.watchPosition( 
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
        
            userMarker.setLatLng([userLat, userLng]);
            map.setView([userLat, userLng], 15);
        },
        (error) => {
            console.error(`Geolokation fejl: ${error.message}`);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
} else {
    console.error("browseren understøtter ikke geolokation")
}; */

//Indlæs scenarie

async function loadScenario() {
  const response = await fetch("data.json");
  const scenario = await response.json();

  tasks = scenario.tasks.sort((a, b) => a.orderNumber - b.orderNumber);
  receiveScenario(scenario);
  activateNextTask();
}

//aktiver zone

function activateNextTask() {
  if (currentTaskIndex >= tasks.length) return;

  activeTask = tasks[currentTaskIndex];
  activeTask.popupShown = false;

  if (activeZone) map.removeLayer(activeZone);

  activeZone = L.circle([activeTask.mapLat, activeTask.mapLng], {
    radius: activeTask.mapRadiusInMeters,
    color: "#ffffffff",
    fillColor: "#8D1B3D",
    fillOpacity: 0.3,
  }).addTo(map);
}

//Simuler bevægelse (TO DO: se "Kald når brugeren flytter sig" - vi kan nøjes med én af dem - tilføj eft. updateCoordinates her og slet den anden)

map.on("click", (e) => {
  userMarker.setLatLng(e.latlng);
  checkZone();
});

// Simuler "hånd" der bevæger sig ind i zonen

map.on("mousemove", (e) => {
  userMarker.setLatLng(e.latlng);
  updateCoordinates(e.latlng.lat, e.latlng.lng);
  checkZone();
});

//Opdater koordinator i topbar

function updateCoordinates(lat, lng) {
  document.getElementById("coords").textContent = `Lat: ${lat.toFixed(
    5
  )} | Lng: ${lng.toFixed(5)}`;
}

//Kald når brugeren flytter sig

map.on("click", (e) => {
  userMarker.setLatLng(e.latlng);
  updateCoordinates(e.latlng.lat, e.latlng.lng);
  checkZone();
});

//Tjek om brugeren er i zonen
function checkZone() {
  if (!activeTask || activeTask.popupShown) return;

  const userPos = userMarker.getLatLng();
  const taskPos = L.latLng(activeTask.mapLat, activeTask.mapLng);

  const distance = userPos.distanceTo(taskPos);

  if (distance <= activeTask.mapRadiusInMeters) {
    showPopup(activeTask);
    activeTask.popupShown = true;
    receiveTaskActivated(activeTask.idT);
    console.log("Task activated:", activeTask.idT);
  }
}

//Popup visning

function showPopup(task) {
  document.getElementById("popupTitle").textContent =
    "Mission " + task.orderNumber;

  document.getElementById("popupDescription").textContent =
    task.taskDescription;

  document.getElementById("popup").classList.remove("hidden");
}

//Popup-knapper

//Luk popup
document.getElementById("closePopupBtn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

//Gå til misson
document.getElementById("goToMissionBtn").onclick = () => {
  mapView.classList.remove("active");
  taskView.classList.add("active");
  showingMap = false;
  document.getElementById("popup").classList.add("hidden");
};

//Skift mellem map og opgaveliste

const toggleBtn = document.getElementById("toggleViewBtn");
const mapView = document.getElementById("mapView");
const taskView = document.getElementById("taskView");

let showingMap = true;

toggleBtn.onclick = () => {
  showingMap = !showingMap;

  mapView.classList.toggle("active", showingMap);
  taskView.classList.toggle("active", !showingMap);

  toggleBtn.textContent = showingMap ? "Gå til opgaver" : "Tilbage til kort";

  if (showingMap) {
    setTimeout(() => map.invalidateSize(), 100);
  }
};

//Fjerner aktiv zone og aktiverer næste opgave på kortet, når mission er fuldført

export function taskCompletedCallback(taskId) {
  console.log("Maja får besked: mission fuldført", taskId);
  //Fjern nuværende aktive zone på kortet
  if (activeZone) {
    map.removeLayer(activeZone);
    activeZone = null;
  }
  // Aktiver næste opgave
  currentTaskIndex++;
  if (currentTaskIndex < tasks.length) {
    console.log("Aktiverer næste task:", tasks[currentTaskIndex].idT);
    activateNextTask();
  } else {
    console.log("Alle tasks er fuldført");
  }
}

loadScenario();
