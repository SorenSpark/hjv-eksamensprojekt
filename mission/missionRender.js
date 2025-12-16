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

  active.forEach((m) => container.appendChild(createMissionCard(m)));
  locked.forEach((m) => container.appendChild(createMissionCard(m)));
}

function renderCompleted(missions) {
  const container = document.getElementById("completedMissionList");
  container.innerHTML = "";

  missions.forEach((m) => container.appendChild(createMissionCard(m)));
}
