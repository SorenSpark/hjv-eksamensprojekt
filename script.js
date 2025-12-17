import { receiveScenario } from "./missionList.js";
import { receiveTaskActivated } from "./missionList.js";

/* Toggle Dark/light */
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// aktiver dark/light fra localStorage
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    htmlElement.classList.add('light-mode');
    themeToggle.checked = true;
  } else {
    // Default til dark mode
    htmlElement.classList.remove('light-mode');
    themeToggle.checked = false;
    if (!savedTheme) {
      localStorage.setItem('theme', 'dark');
    }
  }
}

function toggleTheme() {
  const isLightMode = themeToggle.checked;
  const theme = isLightMode ? 'light' : 'dark';
  
  if (isLightMode) {
    htmlElement.classList.add('light-mode');
  } else {
    htmlElement.classList.remove('light-mode');
  }
  
  localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('change', toggleTheme);
initTheme();

/* leaflet & openstreetmap */
let map = L.map("map");
map.setView([56.123, 9.123], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap",
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

// Globale variabler
let tasks = [];
let currentTaskIndex = 0;
let activeTask = null;
let activeZone = null;

// VARIABLER TIL ROTATION
let currentRotation = 0;
let lastRawHeading = 0;

// Brugerens markør
// Progress bar elements
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressFillDesktop = document.getElementById('progressFillDesktop');
const progressTextDesktop = document.getElementById('progressTextDesktop');
let totalMissions = 0;
let completedMissions = 0;

// Initialize progress bar
function initializeProgressBar() {
  totalMissions = 3; // Always show 3 missions for consistent progress display
  completedMissions = 0;
  updateProgressBar();
}

// Update progress bar display
function updateProgressBar() {
  const percentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
  const text = `${completedMissions}/${totalMissions}`;
  
  // Update mobile progress bar
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = text;
  
  // Update desktop progress bar
  if (progressFillDesktop) progressFillDesktop.style.width = `${percentage}%`;
  if (progressTextDesktop) progressTextDesktop.textContent = text;
}

const locationMarker = L.icon({
  iconUrl: "assets/locationMarker.svg",
  iconSize: [30, 25],
});

const userMarker = L.marker([56.12, 9.12], {
  icon: locationMarker,
  rotationAngle: 0,
  rotationOrigin: 'center'
}).addTo(map);

// Enhedens orientation
let orientationActive = false;

/* function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && 
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          startOrientationTracking();
        } else {
          console.log('Orientation permission denied');
        }
      })
      .catch(console.error);
  } else {
    startOrientationTracking();
  }
}

function startOrientationTracking() {
  orientationActive = true;
  window.addEventListener('deviceorientationabsolute', handleOrientation, true);
  window.addEventListener('deviceorientation', handleOrientation, true);
}

// Handle orientation til både Android og IOS
function handleOrientation(event) {
    if (!orientationActive) return;
    
    let heading = null;
    if (event.webkitCompassHeading !== undefined) {
        heading = event.webkitCompassHeading; // iOS
    } else if (event.alpha !== null) {
        heading = 360 - event.alpha; // Android
    }

    if (heading !== null && userMarker._icon) {
        // Beregner den korteste vej for at undgå "dødsspin"
        let delta = heading - lastRawHeading;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        currentRotation += delta;
        lastRawHeading = heading;

        applyRotation(); // Kalder hjælpefunktion til at tegne rotationen
    }
}

// HJÆLPEFUNKTION: Påfører rotation på DOM elementet
function applyRotation() {
    if (userMarker._icon) {
        const element = userMarker._icon;
        element.style.transition = 'transform 0.1s linear';
        element.style.transformOrigin = 'center';
        
        // Bevar positionen fra Leaflet (translated) og tilføj vores rotation
        const currentTransform = element.style.transform.replace(/rotate\([\s\S]*?deg\)/g, "");
        element.style.transform = `${currentTransform} rotate(${currentRotation}deg)`;
    }
}

// GEO-LOKATION (Opdateret til at bevare rotation ved bevægelse)
if (navigator.geolocation){
    navigator.geolocation.watchPosition( 
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
        
            userMarker.setLatLng([userLat, userLng]);
            map.setView([userLat, userLng]);
            
            // VIGTIGT: Gen-anvendelse af rotationen her, ellers nulstiller Leaflet den ved hver bevægelse
            applyRotation(); 
            
            updateCoordinates(userLat, userLng);
            checkZone();
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
};

// Kompas aktivering knap
document.getElementById("enableCompass").onclick = () => {
  console.log("🔘 Kompas knap klikket - anmoder om permission");
  requestOrientationPermission();
  // Skjul knappen efter klik
  document.getElementById("enableCompass").style.display = 'none';
}; */

//Vis intro popup
function showIntroPopup(scenario) {
  document.getElementById("introTitle").textContent = scenario.scenarioTitle;
  document.getElementById("introDescription").textContent = scenario.scenarioDescription;
  document.getElementById("introPopup").classList.remove("hidden");
  document.getElementById("introPopup").style.display = "block";
};

//Indlæs scenarie

async function loadScenario() {
  const response = await fetch("data.json");
  const scenario = await response.json();

  tasks = scenario.tasks.sort((a, b) => a.orderNumber - b.orderNumber);
  initializeProgressBar();
  receiveScenario(scenario);
  showIntroPopup(scenario);
};
  
  // Når brugeren klikker start:
  document.getElementById("startScenarioBtn").onclick = () => {
    document.getElementById("introPopup").classList.add("hidden");
    document.getElementById("introPopup").style.display = "none";
    activateNextTask(); // Aktiver første mission
    console.log("Scenario startet", tasks[0].idT);
  };

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
};

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
  document.getElementById("coords").textContent = `Lat: ${lat.toFixed(5)} | Lng: ${lng.toFixed(5)}`;
};

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
};

//Popup visning

function showPopup(task) {
  document.getElementById("popupTitle").textContent =
    "Mission " + task.orderNumber;

  document.getElementById("popupDescription").textContent =
    task.taskDescription;

  document.getElementById("popup").classList.remove("hidden");
};

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
  
  // Update progress bar
  completedMissions++;
  updateProgressBar();
  
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
};

loadScenario();