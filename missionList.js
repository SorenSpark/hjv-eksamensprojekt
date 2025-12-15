// =========================
// Modtag missioner (entry point)
// =========================
// 1. Modtag alle missioner i scenariet (fra Maja)
// Modtag liste med alle missioner
// Hver mission har status: locked, active og completed
//Men her er de vel alle locked fra start? og det skal jeg bygge ind i objektet??
// Gem alle missioner i missionList
// Laveste ID ligger øverst i listen

// mission state
let lockedMissions = [];
let activeMissions = [];
let completedMissions = [];

console.log("completedMissions", completedMissions.length);

//modtag scenarie fra Maja
export function receiveScenario(scenario) {
  //TO DO: skriv scenarie i UI

  receiveMissions(scenario.tasks);
  console.log("Scenario modtaget fra index.js", scenario);
}

//modtag alle missioner / læg dem i locked array, tilføj property
function receiveMissions(missions) {
  console.log("Missions modtaget fra receiveScenario", missions);
  lockedMissions = missions.map((mission) => ({
    ...mission,
    status: "locked",
    selectedOption: null,
  }));

  // Sorter evt. på idT så laveste ID ligger øverst
  lockedMissions.sort((a, b) => a.idT - b.idT);
  console.log("Locked Missions modtaget:", lockedMissions);
  console.log("Locked Missions, antal:", lockedMissions.length);

  // UI:
  // renderLockedMissions(lockedMissions)
  // TO DO: hvordan skal de renderes - hvordan skifter design alt efter state
  createMissionCards(lockedMissions);
}

// 2. Vis missioner i UI
//For hver mission i missionList

function createMissionCards(allMissions) {
  //det er her vi vil placere cards
  const missionList = document.getElementById("activeMissionList");
  missionList.innerHTML = "";

  const missionTemplate = document.getElementById("mission-card-template");

  allMissions.forEach((mission) => {
    const clone = missionTemplate.content.cloneNode(true);
    clone.querySelector(".mission-no").textContent = `Mission ${mission.idT}`;
    clone.querySelector(".mission-title").textContent = mission.taskTitle;
    clone.querySelector(".mission-desc").textContent = mission.taskDesc;

    // Options container
    const optionsContainer = clone.querySelector(".mission-options");
    mission.options.forEach((opt) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `mission-${mission.idT}`; // unik for hver mission
      radio.value = opt.optionId;

      // event listener: aktiver "Udført" knap når valgt
      radio.addEventListener("change", () => {
        const completeBtn = clone.querySelector(".complete-btn");
        completeBtn.disabled = false;
        mission.selectedOption = radio.value; // gem midlertidigt valget
      });

      label.appendChild(radio);
      label.appendChild(document.createTextNode(opt.optionText));
      optionsContainer.appendChild(label);
    });

    missionList.appendChild(clone);
  });
}

// Hvis status === "locked" eller "active"
// opret missionCard i active missions container
// Hvis status === completed:
// Opret mission i completedList container

// 3. MissionCard – locked state
// card foldet sammen, greyed out, låst ikon, accordion kan ikke åbnes, knapper inaktive

// 4. MissionCard – active state
// card foldet ud, accordion aktiveret, titel/beskrivelse/valgmuligheder synlige
// "Udført"-knap inaktiv indtil radiobutton valgt

// 5. Aktivering af mission
// Når en mission bliver aktiv:
//   - opdatér mission.status til "active"
//   - fold card ud, fjern låst ikon, aktiver accordion

export function receiveTaskActivated(missionID) {
  console.log("Modtaget aktivering af task i missionList:", missionID);
  activateMission(missionID);
}

function activateMission(newMissionID) {
  const index = lockedMissions.findIndex((m) => m.idT === newMissionID);
  if (index === -1) return;

  const mission = lockedMissions.splice(index, 1)[0];
  mission.status = "active";
  activeMissions.push(mission);

  console.log("NY Mission aktiveret:", mission);
  console.log("activeMissions", activeMissions.length);
  console.log("lockedMissions efter", lockedMissions.length);

  // 👉 UI:
  // - flyt missionCard fra locked → active
  // - fold card ud
  // - fjern låst ikon
}

// 6. Interaktion i aktiv mission
// Når radiobutton vælges:
//   - gem brugerens svar
//   - aktivér "Udført"-knappen

// 7. Fuldfør mission
// Når "Udført"-knappen klikkes:
//   - gem brugerens svar
//   - opdatér mission.status til "completed"
//   - fjern mission fra active missions container
//   - tilføj missionCard til completedList container

// 8. MissionCard – completed state
// card foldet sammen, checkmark vises, valgt svar markeret med farve
// knap disabled/grå, tekst ændret til "Fuldført"

// 9. Ekstra
// evt. checkmark-animation ved completion
