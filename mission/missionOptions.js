export function buildOptions(mission, wrapper, button) {
  const container = wrapper.querySelector(".mission-options");
  container.innerHTML = "";

  if (!Array.isArray(mission.options)) return;

  mission.options.forEach((opt) => {
    const label = document.createElement("label");
    label.classList.add("option-btn");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = `mission-${mission.idT}`;
    radio.checked = mission.selectedOption === opt.optionId;

    radio.onchange = () => {
      mission.selectedOption = opt.optionId;
      button.disabled = false;
    };

    label.append(radio, opt.optionText);
    container.appendChild(label);
  });
}
