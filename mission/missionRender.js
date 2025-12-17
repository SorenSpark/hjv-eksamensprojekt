import { createMissionCard } from "./missionCard.js";

export function createCardUI({
  lockedMissions,
  activeMissions,
  completedMissions,
}) {
  renderActiveAndLocked(activeMissions, lockedMissions);
  renderCompleted(completedMissions);
}

function renderActiveAndLocked(active, locked) {
  const container = document.getElementById("activeMissionList");
  container.innerHTML = "";

  if (active.length === 0 && locked.length === 0) {
    container.textContent = "Ingen aktive missioner";
    return;
  }

  active.forEach((m) => container.appendChild(createMissionCard(m)));
  locked.forEach((m) => container.appendChild(createMissionCard(m)));
}

function renderCompleted(completed) {
  const container = document.getElementById("completedMissionList");
  container.innerHTML = "";

  if (completed.length === 0) {
    container.textContent = "Ingen fuldførte missioner";
    return;
  }

  completed.forEach((m) => container.appendChild(createMissionCard(m)));
}
