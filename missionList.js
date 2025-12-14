// =========================
// testScenario.js
// =========================

const testScenario = {
  scenarioId: "S1",
  scenarioTitle: "Finderup Natøvelse",
  scenarioDescription: "Denne scenario er oprettet til formål med ..",
  tasks: [
    {
      idT: 101,
      taskId: "T15",
      taskTitle: "Patrulje i nat",
      taskDescription: "Se efter i området for at se, om alt er ok",
      options: [
        {
          optionId: "A",
          optionText:
            "Patruljen gennemfører en stille og systematisk rute gennem zonen",
          isCorrect: true,
        },
        {
          optionId: "B",
          optionText:
            "Patruljen bliver ved køretøjerne og observerer kun derfra",
          isCorrect: false,
        },
        {
          optionId: "C",
          optionText: "Patruljen tænder alt lys for at få fuldt overblik",
          isCorrect: false,
        },
      ],
    },
    {
      idT: 102,
      taskId: "T8",
      taskTitle: "Observation nord",
      taskDescription: "Observation af aktivitet i området mod nord",
      options: [
        {
          optionId: "A",
          optionText:
            "Observationsposten etableres i dækning med udsyn mod nord",
          isCorrect: true,
        },
        {
          optionId: "B",
          optionText:
            "Observationsposten etableres midt på vejen for bedst udsyn",
          isCorrect: false,
        },
      ],
    },
  ],
};

// Simulerer fetch fra Maja
function fetchTestScenario() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tilføj status = 'locked' til alle tasks
      testScenario.tasks.forEach((task) => (task.status = "locked"));
      resolve(testScenario);
    }, 200);
  });
}

// =========================
// Init app
// =========================

async function init() {
  const scenario = await fetchTestScenario();
  // modtag alle tasks fra scenario
  receiveMissions(scenario.tasks);
}

init();

// =========================
// Modtag missioner (entry point)
// =========================
// 1. Modtag alle missioner i scenariet (fra Maja)
// Modtag liste med alle missioner
// Hver mission har status: locked, active og completed
//Men her er de vel alle locked fra start? og det skal jeg bygge ind i objektet??
// Gem alle missioner i missionList
// Laveste ID ligger øverst i listen

let missionList = []; // her gemmer vi alle missions i array

function receiveMissions(missions) {
  // Sorter evt. på idT så laveste ID ligger øverst
  missionList = missions.slice().sort((a, b) => a.idT - b.idT);
  console.log("Missioner modtaget i missionList:", missionList);

  // Her kan du senere kalde render / UI funktioner
  // f.eks. renderAllMissions(missionList)

  createMissionCards(missionList);
}

// 2. Vis missioner i UI
//For hver mission i missionList
// Hvis status === "locked" eller "active"
// opret missionCard i active missions container
// Hvis status === completed:
// Opret mission i completedList container
function createMissionCards(missionData) {
  console.log("missionData:", missionData);

  missionData.forEach((mission) => {
    console.log("status", mission.status);
    console.log("status", mission.taskTitle);
  });
}

// 3. MissionCard – locked state
// card foldet sammen, greyed out, låst ikon, accordion kan ikke åbnes, knapper inaktive

// 4. MissionCard – active state
// card foldet ud, accordion aktiveret, titel/beskrivelse/valgmuligheder synlige
// "Udført"-knap inaktiv indtil radiobutton valgt

// 5. Aktivering af mission
// Når en mission bliver aktiv:
//   - opdatér mission.status til "active"
//   - fold card ud, fjern låst ikon, aktiver accordion

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
