import { taskCompletedCallback } from "./script.js";

// =========================
// Arrays til mission states
// =========================
let lockedMissions = [];
let activeMissions = [];
let completedMissions = [];

// =========================
// Modtager scenarier
// =========================
export function receiveScenario(scenario) {
  console.log("Scenario modtaget:", scenario);
  receiveMissions(scenario.tasks);

  // Opdater HTML med titel og beskrivelse
  document.querySelector(".scenario-title").textContent =
    scenario.scenarioTitle;
  document.querySelector(".scenario-desc").textContent =
    scenario.scenarioDescription;
}

// =========================
// MODTAG & INITIALISÉR MISSIONS
// =========================
function receiveMissions(missions) {
  lockedMissions = missions
    .map((mission, index) => ({
      ...mission,
      status: "locked", //alle er locked når de hentes ind
      selectedOption: null,
      OrderNumber: index + 1, //giver mission tal efter rækkefølge
    }))
    .sort((a, b) => a.idT - b.idT);

  createCardUI();
}

// =========================
// Modtager aktiv mission - ryk til aktiv liste
// =========================
export function receiveTaskActivated(idT) {
  const index = lockedMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = lockedMissions.splice(index, 1)[0];
  mission.status = "active";
  activeMissions.push(mission);

  createCardUI();
}

// =========================
// Fuldfør mission - ryk til completed liste
// =========================
function receiveTaskCompleted(idT) {
  const index = activeMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = activeMissions.splice(index, 1)[0];
  mission.status = "completed";
  completedMissions.push(mission);

  createCardUI();

  //lad maja vide at mission er gennemført
  taskCompletedCallback(idT);
}

// =========================
// create cards i ui
// =========================
function createCardUI() {
  renderActiveAndLocked();
  renderCompleted();
}

// function renderActiveAndLocked() {
//   const container = document.getElementById("activeMissionList");
//   container.innerHTML = "";

//   [...lockedMissions, ...activeMissions].forEach((mission) => {
//     container.appendChild(createMissionCard(mission));
//   });
// }

function renderActiveAndLocked() {
  const container = document.getElementById("activeMissionList");
  container.innerHTML = "";

  activeMissions.forEach((mission) => {
    container.appendChild(createMissionCard(mission));
  });

  lockedMissions.forEach((mission) => {
    container.appendChild(createMissionCard(mission));
  });
}

function renderCompleted() {
  const container = document.getElementById("completedMissionList");
  container.innerHTML = "";

  completedMissions.forEach((mission) => {
    container.appendChild(createMissionCard(mission));
  });
}

// =========================
// Create mission card (kloner html template)
// =========================
function createMissionCard(mission) {
  const template = document.getElementById("mission-card-template");
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".mission-card");
  const header = clone.querySelector(".mission-card-header");
  const wrapper = clone.querySelector(".mission-desc-wrapper");
  const statusIcon = clone.querySelector(".mission-status-icon");
  const completeBtn = clone.querySelector(".complete-btn");

  // data
  clone.querySelector(
    ".mission-no"
  ).textContent = `Mission ${mission.OrderNumber}`;
  clone.querySelector(".mission-title").textContent = mission.taskTitle;
  clone.querySelector(".mission-desc").textContent = mission.taskDescription;

  // tilføjer klasser til styling
  card.classList.add(`state-${mission.status}`);

  // OPTIONS
  buildOptions(mission, wrapper);

  setTaskTypeIcon(mission, clone);

  // forskellige stadier
  if (mission.status === "locked") {
    applyLockedState(card, wrapper, statusIcon);
  }

  if (mission.status === "active") {
    applyActiveState(card, wrapper, mission, completeBtn);
    enableAccordion(header, wrapper, card, true);
  }

  if (mission.status === "completed") {
    applyCompletedState(card, wrapper, statusIcon);
    enableAccordion(header, wrapper, card, false);
  }

  return clone;
}

function setTaskTypeIcon(mission, card) {
  const icon = card.querySelector(".mission-desc-icon");
  if (!icon) return;

  if (mission.taskType === "Land") {
    console.log("terr");
    icon.textContent = "terrain"; // Google Material ikon
  } else if (mission.taskType === "Vand") {
    icon.textContent = "water"; // Google Material ikon
  }
}

// =========================
// options - bygger radio buttons
// =========================
// function buildOptions(mission, wrapper) {
//   if (!Array.isArray(mission.options)) return;

//   const container = wrapper.querySelector(".mission-options");
//   container.innerHTML = "";

//   mission.options.forEach((opt) => {
//     const label = document.createElement("label");
//     label.classList.add("option-btn");
//     const radio = document.createElement("input");

//     radio.type = "radio";
//     radio.name = `mission-${mission.idT}`;
//     radio.value = opt.optionId;
//     radio.checked = mission.selectedOption === opt.optionId;

//     radio.addEventListener("change", () => {
//       mission.selectedOption = opt.optionId;
//       createCardUI();
//     });

//     label.appendChild(radio);
//     label.append(opt.optionText);
//     container.appendChild(label);
//   });
// }
function buildOptions(mission, wrapper) {
  if (!Array.isArray(mission.options)) return;

  const container = wrapper.querySelector(".mission-options");
  container.innerHTML = "";

  mission.options.forEach((opt) => {
    // Label = selve "knappen"
    const label = document.createElement("label");
    label.classList.add("option-btn");

    // Radio input (skjult via CSS)
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `mission-${mission.idT}`;
    radio.value = opt.optionId;
    radio.checked = mission.selectedOption === opt.optionId;

    // Tekst i span (styling target)
    const text = document.createElement("span");
    text.textContent = opt.optionText;

    // Når man vælger en option
    radio.addEventListener("change", () => {
      mission.selectedOption = opt.optionId;

      createCardUI();
    });

    // Sammensæt label
    label.appendChild(radio);
    label.appendChild(text);

    // Ind i DOM
    container.appendChild(label);
  });
}

// =========================
// accordion
// =========================
// function enableAccordion(header, wrapper) {
//   // wrapper.classList.add("collapsed");

//   header.onclick = () => {
//     wrapper.classList.toggle("collapsed");
//   };
// }

// function enableAccordion(header, wrapper, card) {
//   // start lukket
//   wrapper.classList.add("collapsed");
//   card.classList.add("is-collapsed");

//   header.onclick = () => {
//     const isCollapsed = wrapper.classList.contains("collapsed");

//     wrapper.classList.toggle("collapsed");
//     card.classList.toggle("is-collapsed", !isCollapsed);
//     card.classList.toggle("is-open", isCollapsed);
//   };
// }
function enableAccordion(header, wrapper, card, startOpen = false) {
  if (startOpen) {
    wrapper.classList.remove("collapsed");
    card.classList.add("is-open");
    card.classList.remove("is-collapsed");
  } else {
    wrapper.classList.add("collapsed");
    card.classList.add("is-collapsed");
    card.classList.remove("is-open");
  }

  header.onclick = () => {
    const isCollapsed = wrapper.classList.contains("collapsed");

    wrapper.classList.toggle("collapsed");
    card.classList.toggle("is-open", isCollapsed);
    card.classList.toggle("is-collapsed", !isCollapsed);
  };
}

function disableAccordion(wrapper) {
  wrapper.classList.add("collapsed");
}

// IKON
function setStatusIcon(container, iconName) {
  container.innerHTML = `
    <span class="material-symbols-outlined">
      ${iconName}
    </span>
  `;
}

// =========================
// state styles
// TO DO: sæt rigtige ikoner ind
// =========================
function applyLockedState(card, wrapper, icon) {
  disableAccordion(wrapper);
  setStatusIcon(icon, "lock");

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });
}

function applyActiveState(card, wrapper, mission, button) {
  setStatusIcon(card.querySelector(".mission-status-icon"), "circle");
  button.disabled = !mission.selectedOption;
  button.onclick = () => {
    receiveTaskCompleted(mission.idT);
  };
}

// TO DO: ændre til rigtigt ikon
function applyCompletedState(card, wrapper, icon) {
  wrapper.classList.add("collapsed");
  setStatusIcon(icon, "check_circle");

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });

  const btn = wrapper.querySelector(".complete-btn");
  btn.textContent = "Fuldført";
}
