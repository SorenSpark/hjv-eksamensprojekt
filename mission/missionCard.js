import { completeMission } from "./missionState.js";
import { buildOptions } from "./missionOptions.js";
import { enableAccordion } from "./missionAccordion.js";

// Her bliver mission cards bygget ud fra html templaten
export function createMissionCard(mission) {
  const template = document.getElementById("mission-card-template");
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".mission-card");
  const header = clone.querySelector(".mission-card-header");
  const wrapper = clone.querySelector(".mission-desc-wrapper");
  const statusIcon = clone.querySelector(".mission-status-icon");
  const completeButton = clone.querySelector(".complete-btn");

  // Data indsættes i klon
  clone.querySelector(
    ".mission-no"
  ).textContent = `Mission ${mission.OrderNumber}`;
  clone.querySelector(".mission-title").textContent = mission.taskTitle;
  clone.querySelector(".mission-desc").textContent = mission.taskDescription;

  // Tilføjer klasse til styling af forskellige states
  card.classList.add(`state-${mission.status}`);

  buildOptions(mission, wrapper, completeButton); //kalder funktion i missionOptions.js modul
  applyState({ mission, card, header, wrapper, statusIcon, completeButton });

  return clone;
}

//udgangspunkt for cards alt efter
function applyState({
  mission,
  card,
  header,
  wrapper,
  statusIcon,
  completeButton,
}) {
  switch (mission.status) {
    case "locked":
      setIcon(statusIcon, "lock");
      wrapper.classList.add("collapsed");
      disable(card);
      header.onclick = null;
      break;

    case "active":
      setIcon(statusIcon, "radio_button_unchecked");
      completeButton.disabled = !mission.selectedOption;
      completeButton.onclick = () => completeMission(mission.idT);
      enableAccordion(header, wrapper, card, true);
      break;

    case "completed":
      setIcon(statusIcon, "check_circle");
      wrapper.classList.add("collapsed");
      disable(card);
      completeButton.textContent = "Fuldført";
      enableAccordion(header, wrapper, card, false);
      break;
  }
}

function disable(card) {
  card
    .querySelectorAll("input, completeButton")
    .forEach((e) => (e.disabled = true));
}

function setIcon(el, name) {
  el.innerHTML = `<span class="material-symbols-outlined">${name}</span>`;
}
