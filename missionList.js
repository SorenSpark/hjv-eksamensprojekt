// =========================
// Mission state
// =========================
let lockedMissions = [];
let activeMissions = [];
let completedMissions = [];

// =========================
// ENTRY POINT FRA MAJA
// =========================
export function receiveScenario(scenario) {
  console.log("Scenario modtaget:", scenario);
  receiveMissions(scenario.tasks);
}

// =========================
// MODTAG & INITIALISÉR MISSIONS
// =========================
function receiveMissions(missions) {
  lockedMissions = missions
    .map((mission) => ({
      ...mission,
      status: "locked",
      selectedOption: null,
    }))
    .sort((a, b) => a.idT - b.idT);

  renderUI();
}

// =========================
// AKTIVER MISSION (fra Maja)
// =========================
export function receiveTaskActivated(idT) {
  const index = lockedMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = lockedMissions.splice(index, 1)[0];
  mission.status = "active";
  activeMissions.push(mission);

  renderUI();
}

// =========================
// FULDFØR MISSION
// =========================
function receiveTaskCompleted(idT) {
  const index = activeMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = activeMissions.splice(index, 1)[0];
  mission.status = "completed";
  completedMissions.push(mission);

  renderUI();
}

// =========================
// RENDER UI (SINGLE SOURCE)
// =========================
function renderUI() {
  renderActiveAndLocked();
  renderCompleted();
}

function renderActiveAndLocked() {
  const container = document.getElementById("activeMissionList");
  container.innerHTML = "";

  [...lockedMissions, ...activeMissions].forEach((mission) => {
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
// CREATE MISSION CARD
// =========================
function createMissionCard(mission) {
  const template = document.getElementById("mission-card-template");
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".mission-card");
  const header = clone.querySelector(".mission-card-header");
  const body = clone.querySelector(".mission-desc-wrapper");
  const statusIcon = clone.querySelector(".mission-status-icon");
  const completeBtn = clone.querySelector(".complete-btn");

  // DATA
  clone.querySelector(".mission-no").textContent = `Mission ${mission.idT}`;
  clone.querySelector(".mission-title").textContent = mission.taskTitle;
  clone.querySelector(".mission-desc").textContent = mission.taskDescription;

  card.classList.add(`state-${mission.status}`);

  // OPTIONS
  buildOptions(mission, body);

  // STATE HANDLING
  if (mission.status === "locked") {
    applyLockedState(card, body, statusIcon);
  }

  if (mission.status === "active") {
    applyActiveState(card, body, mission, completeBtn);
    enableAccordion(header, body);
  }

  if (mission.status === "completed") {
    applyCompletedState(card, body, statusIcon);
    enableAccordion(header, body);
  }

  return clone;
}

// =========================
// OPTIONS
// =========================
function buildOptions(mission, body) {
  if (!Array.isArray(mission.options)) return;

  const container = body.querySelector(".mission-options");
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
      renderUI();
    });

    label.appendChild(radio);
    label.append(opt.optionText);
    container.appendChild(label);
  });
}

// =========================
// ACCORDION
// =========================
function enableAccordion(header, body) {
  body.classList.add("collapsed");

  header.onclick = () => {
    body.classList.toggle("collapsed");
  };
}

function disableAccordion(body) {
  body.classList.add("collapsed");
}

// =========================
// STATE STYLES
// =========================
function applyLockedState(card, body, icon) {
  disableAccordion(body);
  icon.textContent = "🔒";

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });
}

function applyActiveState(card, body, mission, button) {
  button.disabled = !mission.selectedOption;

  button.onclick = () => {
    receiveTaskCompleted(mission.idT);
  };
}

function applyCompletedState(card, body, icon) {
  icon.textContent = "✔";

  card.querySelectorAll("input, button").forEach((el) => {
    el.disabled = true;
  });

  const btn = body.querySelector(".complete-btn");
  btn.textContent = "Fuldført";
}
