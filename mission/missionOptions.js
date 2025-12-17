export function buildOptions(mission, wrapper, button) {
  const container = wrapper.querySelector(".mission-options");
  container.innerHTML = "";

  if (!Array.isArray(mission.options)) return;

  mission.options.forEach((optText, i) => {
    const label = document.createElement("label");
    label.classList.add("option-btn");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `mission-${mission.idT}`;
    radio.value = i;
    radio.checked = mission.selectedOption === i;

    // Tekst i span
    const span = document.createElement("span");
    span.textContent = optText;

    radio.addEventListener("change", () => {
      mission.selectedOption = i;
      if (button) button.disabled = false;
    });
    label.appendChild(radio);
    label.appendChild(span);
    container.appendChild(label);
  });
}
