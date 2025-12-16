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

  // forskellige stadier
  if (mission.status === "locked") {
    applyLockedState(card, wrapper, statusIcon);
  }

  if (mission.status === "active") {
    applyActiveState(card, wrapper, mission, completeBtn);
    enableAccordion(header, wrapper);
  }

  if (mission.status === "completed") {
    applyCompletedState(card, wrapper, statusIcon);
    enableAccordion(header, wrapper);
  }

  return clone;
}

// =========================
// options - bygger radio buttons
// =========================
function buildOptions(mission, wrapper) {
  if (!Array.isArray(mission.options)) return;

  const container = wrapper.querySelector(".mission-options");
  container.innerHTML = "";

  mission.options.forEach((opt) => {
    const label = document.createElement("label");
    const radio = document.createElement("input");

    radio.type = "radio";
    radio.name = `mission-${mission.idT}`;
    radio.value = opt.optionId;
    radio.checked = mission.selectedOption === opt.optionId;

    radio.addEventListener("change", () => {
      mission.selectedOption = opt.optionId;
      createCardUI();
    });

    label.appendChild(radio);
    label.append(opt.optionText);
    container.appendChild(label);
  });
}

// =========================
// accordion
// =========================
function enableAccordion(header, wrapper) {
  // wrapper.classList.add("collapsed");

  header.onclick = () => {
    wrapper.classList.toggle("collapsed");
  };
}

function disableAccordion(wrapper) {
  wrapper.classList.add("collapsed");
}

// =========================
// state styles
// TO DO: sæt rigtige ikoner ind
// =========================
function applyLockedState(card, wrapper, icon) {
  disableAccordion(wrapper);
  icon.textContent = "🔒";

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });
}

function applyActiveState(card, wrapper, mission, button) {
  button.disabled = !mission.selectedOption;

  button.onclick = () => {
    receiveTaskCompleted(mission.idT);
  };
}

// TO DO: ændre til rigtigt ikon
function applyCompletedState(card, wrapper, icon) {
  wrapper.classList.add("collapsed");
  icon.textContent = "✔";

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });

  const btn = wrapper.querySelector(".complete-btn");
  btn.textContent = "Fuldført";
}
