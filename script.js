// Navnet på nøglen, dataene gemmes under i localStorage.
// Dette skal bruges på alle andre sider, der skal tilgå dataene.
const STORAGE_KEY = 'uploadedJsonData'; 

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('jsonFileInput');
    
    // Tjekker om elementet eksisterer, før vi tilføjer lytteren
    if (!fileInput) {
        console.error("Fejl: Kunne ikke finde inputfeltet med ID 'jsonFileInput'.");
        return;
    }

    // Lytter efter, når en fil er valgt (når indholdet 'ændres')
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const jsonString = e.target.result;
                    
                    // 1. Først validerer vi dataen ved at forsøge at parse den.
                    // Hvis dette mislykkes, er JSON-filen ugyldig.
                    JSON.parse(jsonString);

                    /* 2. Hvis valideringen lykkedes, gemmer vi den raw JSON-streng
                     i browserens LocalStorage. */
                    localStorage.setItem(STORAGE_KEY, jsonString);

                    console.log(`SUCCESS: JSON-data fra filen "${file.name}" er gemt i LocalStorage under nøglen: ${STORAGE_KEY}`);

                    // Valgfrit: Nulstil inputfeltet, så samme fil kan vælges igen
                    event.target.value = ''; 

                } catch (error) {
                    console.error("FEJL: Kunne ikke læse filen. Sikr dig, at det er en gyldig JSON-fil.", error);
                    // Fjern gamle data, hvis den nye fil er ugyldig
                    localStorage.removeItem(STORAGE_KEY); 
                }
            };

            // Læs filen som tekst
            reader.readAsText(file);
        } else {
            console.log("Ingen fil valgt.");
        }
    });
});

/* leaflet & openstreetmap */
let map = L.map("map").setView([56.123, 9.123], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

setTimeout(() => {
  map.invalidateSize();
}, 100);

//globale variabler

let tasks = [];
let currentTaskIndex = 0;
let activeTask = null;
let activeZone = null;

const userMarker = L.marker([56.12, 9.12]).addTo(map);

//Indlæs scenarie

async function loadScenario() {
  const response = await fetch("data.json");
  const scenario = await response.json();

  tasks = scenario.tasks.sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  activateNextTask();
}

//aktiver zone

function activateNextTask() {
  if (currentTaskIndex >= tasks.length) return;

  activeTask = tasks[currentTaskIndex];
  activeTask.popupShown = false;

  if (activeZone) map.removeLayer(activeZone);

  activeZone = L.circle(
    [activeTask.mapLat, activeTask.mapLng],
    {
      radius: activeTask.mapRadiusInMeters,
      color: "#ffffff",
      fillColor: "#ffffff",
      fillOpacity: 0.2,
    }
  ).addTo(map);
}

//Simuler bevægelse


map.on("click", e => {
  userMarker.setLatLng(e.latlng);
  checkZone();
});

// Simuler "hånd" der bevæger sig ind i zonen
map.on("mousemove", e => {
  userMarker.setLatLng(e.latlng);
  updateCoordinates(e.latlng.lat, e.latlng.lng);
  checkZone();
});

//Opdater koordinator i topbar

function updateCoordinates(lat, lng) {
  document.getElementById("coords").textContent =
    `Lat: ${lat.toFixed(5)} | Lng: ${lng.toFixed(5)}`;
}

//Kald når brugeren flytter sig

map.on("click", e => {
  userMarker.setLatLng(e.latlng);
  updateCoordinates(e.latlng.lat, e.latlng.lng);
  checkZone();
});

//Tjek om brugeren er i zonen

function checkZone() {
  if (!activeTask || activeTask.popupShown) return;

  const userPos = userMarker.getLatLng();
  const taskPos = L.latLng(
    activeTask.mapLat,
    activeTask.mapLng
  );

  const distance = userPos.distanceTo(taskPos);

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

  document.getElementById("popup").classList.remove("hidden");
}

//Popup-knapper

document.getElementById("closePopupBtn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

document.getElementById("goToMissionBtn").onclick = () => {
  // 👉 link til din medstuderendes side
  window.location.href = "mission.html?taskId=" + activeTask.taskId;
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

  toggleBtn.textContent = showingMap
    ? "Gå til opgaver"
    : "Tilbage til kort";

  if (showingMap) {
    setTimeout(() => map.invalidateSize(), 100);
  }
};


//Start

loadScenario();