import { receiveMissions, activateMission } from "./mission/missionState.js";

export function receiveScenario(scenario) {
  console.log("Scenario modtaget:", scenario);

  document.querySelector(".scenario-title").textContent =
    scenario.scenarioTitle;

  document.querySelector(".scenario-desc").textContent =
    scenario.scenarioDescription;

  receiveMissions(scenario.tasks);
}

export function receiveTaskActivated(idT) {
  activateMission(idT);
}
