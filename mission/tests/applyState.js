import { applyState } from "../missionCard.js";

describe("applyState – locked", () => {
  test("locked mission disables card and collapses wrapper", () => {
    // fake DOM-elementer
    const card = document.createElement("div");
    const wrapper = document.createElement("div");
    const header = document.createElement("div");
    const statusIcon = document.createElement("div");
    const button = document.createElement("button");

    // fake input i card
    const input = document.createElement("input");
    card.appendChild(input);
    card.appendChild(button);

    const mission = { status: "locked" };

    applyState({
      mission,
      card,
      header,
      wrapper,
      statusIcon,
      completeButton: button,
    });

    expect(wrapper.classList.contains("collapsed")).toBe(true);
    expect(input.disabled).toBe(true);
    expect(statusIcon.innerHTML).toContain("lock");
  });
});
