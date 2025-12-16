import { completeMission } from "./missionState.js";
import { buildOptions } from "./missionOptions.js";
import { enableAccordion } from "./missionAccordion.js";

export function createMissionCard(mission) {
  const template = document.getElementById("mission-card-template");
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".mission-card");
  const header = clone.querySelector(".mission-card-header");
  const wrapper = clone.querySelector(".mission-desc-wrapper");
  const statusIcon = clone.querySelector(".mission-status-icon");
  const button = clone.querySelector(".complete-btn");

  // Data indsættes i klon
  clone.querySelector(
    ".mission-no"
  ).textContent = `Mission ${mission.OrderNumber}`;
  clone.querySelector(".mission-title").textContent = mission.taskTitle;
  clone.querySelector(".mission-desc").textContent = mission.taskDescription;

  // Tilføjer klasse til styling af forskellige states
  card.classList.add(`state-${mission.status}`);

  buildOptions(mission, wrapper, button); //kalder funktion i missionOptions.js modul
  applyState({ mission, card, header, wrapper, statusIcon, button });

  return clone;
}

function applyState({ mission, card, header, wrapper, statusIcon, button }) {
  switch (mission.status) {
    case "locked":
      setIcon(statusIcon, "lock");
      wrapper.classList.add("collapsed");
      disable(card);
      header.onclick = null;
      break;

    case "active":
      setIcon(statusIcon, "radio_button_unchecked");
      button.disabled = !mission.selectedOption;
      button.onclick = () => completeMission(mission.idT);
      enableAccordion(header, wrapper, card, true);
      break;

    case "completed":
      setIcon(statusIcon, "check_circle");
      wrapper.classList.add("collapsed");
      disable(card);
      button.textContent = "Fuldført";
      enableAccordion(header, wrapper, card, false);
      break;
  }
}

function disable(card) {
  card.querySelectorAll("input, button").forEach((e) => (e.disabled = true));
}

function setIcon(el, name) {
  el.innerHTML = `<span class="material-symbols-outlined">${name}</span>`;
}
