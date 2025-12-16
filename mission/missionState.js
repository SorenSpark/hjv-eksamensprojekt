import { createCardUI } from "./missionRender.js";
import { taskCompletedCallback } from "../script.js"; // juster stien efter din struktur

// =========================
// arrays til forskellige states
// =========================
let lockedMissions = [];
let activeMissions = [];
let completedMissions = [];

// =========================
// modtager missioner og sætter dem alle til status: locked
// =========================
export function receiveMissions(missions) {
  lockedMissions = missions.map((mission, index) => ({
    ...mission,
    status: "locked",
    selectedOption: null,
    OrderNumber: index + 1,
  }));

  createCardUI(getState());
}

// =========================
// ændringer i states
// =========================
export function activateMission(idT) {
  const index = lockedMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = lockedMissions.splice(index, 1)[0];
  mission.status = "active";
  activeMissions.push(mission);

  createCardUI(getState());
}

export function completeMission(idT) {
  const index = activeMissions.findIndex((m) => m.idT === idT);
  if (index === -1) return;

  const mission = activeMissions.splice(index, 1)[0];
  mission.status = "completed";
  completedMissions.push(mission);

  createCardUI(getState());

  if (taskCompletedCallback) {
    taskCompletedCallback(idT); // Maja får besked
  }
}

// =========================
// tjekker aktuel mission tilstand
// =========================
export function getState() {
  return {
    lockedMissions,
    activeMissions,
    completedMissions,
  };
}
