export function enableAccordion(header, wrapper, card, startOpen = false) {
  const chevron = header.querySelector(".accordion-icon");

  wrapper.classList.toggle("collapsed", !startOpen);
  card.classList.toggle("is-open", startOpen);
  card.classList.toggle("is-collapsed", !startOpen);
  chevron.classList.toggle("rotated", startOpen);

  header.onclick = () => {
    const isClosed = wrapper.classList.toggle("collapsed");
    card.classList.toggle("is-open", !isClosed);
    card.classList.toggle("is-collapsed", isClosed);
    chevron.classList.toggle("rotated", !isClosed);
  };
}
