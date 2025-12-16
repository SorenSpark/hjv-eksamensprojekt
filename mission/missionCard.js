import { completeMission } from "./missionState.js";

export function createMissionCard(mission) {
  const template = document.getElementById("mission-card-template");
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".mission-card");
  const header = clone.querySelector(".mission-card-header");
  const wrapper = clone.querySelector(".mission-desc-wrapper");
  const statusIcon = clone.querySelector(".mission-status-icon");
  const button = clone.querySelector(".complete-btn");

  // DATA
  clone.querySelector(
    ".mission-no"
  ).textContent = `Mission ${mission.OrderNumber}`;
  clone.querySelector(".mission-title").textContent = mission.taskTitle;
  clone.querySelector(".mission-desc").textContent = mission.taskDescription;

  card.classList.add(`state-${mission.status}`);

  buildOptions(mission, wrapper, button);

  // =========================
  // STATES
  // =========================
  if (mission.status === "locked") {
    wrapper.classList.add("collapsed");
    card.classList.add("is-collapsed");
    setStatusIcon(statusIcon, "lock");
    disable(card);
    header.onclick = null; // sikrer, at accordion ikke kan åbnes
  }

  if (mission.status === "active") {
    setStatusIcon(statusIcon, "radio_button_unchecked");
    button.disabled = !mission.selectedOption;
    button.onclick = () => completeMission(mission.idT);

    // Kun active missions får accordion
    enableAccordion(header, wrapper, card, true);
  }

  if (mission.status === "completed") {
    wrapper.classList.add("collapsed");
    setStatusIcon(statusIcon, "check_circle");
    disable(card);
    button.textContent = "Fuldført";

    // Completed kan stadig åbnes, men starter lukket
    enableAccordion(header, wrapper, card, false);
  }

  return clone;
}

// =========================
// helpers
// =========================
function buildOptions(mission, wrapper, button) {
  const container = wrapper.querySelector(".mission-options");
  container.innerHTML = "";

  if (!Array.isArray(mission.options)) return;

  mission.options.forEach((opt) => {
    const label = document.createElement("label");
    label.classList.add("option-btn");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `mission-${mission.idT}`;
    radio.value = opt.optionId;
    radio.checked = mission.selectedOption === opt.optionId;

    radio.onchange = () => {
      mission.selectedOption = opt.optionId;
      button.disabled = false;
    };

    label.append(radio, opt.optionText);
    container.appendChild(label);
  });
}

function enableAccordion(header, wrapper, card, startOpen = false) {
  const chevron = header.querySelector(".accordion-icon");

  // Starttilstand
  if (startOpen) {
    wrapper.classList.remove("collapsed");
    card.classList.add("is-open");
    card.classList.remove("is-collapsed");
    chevron.classList.add("rotated");
  } else {
    wrapper.classList.add("collapsed");
    card.classList.add("is-collapsed");
    card.classList.remove("is-open");
    chevron.classList.remove("rotated");
  }

  // Klik på header
  header.onclick = () => {
    const isCollapsed = wrapper.classList.contains("collapsed");

    wrapper.classList.toggle("collapsed");
    card.classList.toggle("is-open", isCollapsed);
    card.classList.toggle("is-collapsed", !isCollapsed);

    chevron.classList.toggle("rotated", isCollapsed);
  };
}

function disable(card) {
  card.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
}

function setStatusIcon(container, iconName) {
  container.innerHTML = `
    <span class="material-symbols-outlined">
      ${iconName}
    </span>
  `;
}
