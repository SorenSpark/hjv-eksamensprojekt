// function enableAccordion(header, wrapper, card, startOpen = false) {
//   const chevron = header.querySelector(".accordion-icon");

//   // Starttilstand
//   if (startOpen) {
//     wrapper.classList.remove("collapsed");
//     card.classList.add("is-open");
//     card.classList.remove("is-collapsed");
//     chevron.classList.add("rotated");
//   } else {
//     wrapper.classList.add("collapsed");
//     card.classList.add("is-collapsed");
//     card.classList.remove("is-open");
//     chevron.classList.remove("rotated");
//   }

//   // Klik på header
//   header.onclick = () => {
//     const isCollapsed = wrapper.classList.contains("collapsed");

//     wrapper.classList.toggle("collapsed");
//     card.classList.toggle("is-open", isCollapsed);
//     card.classList.toggle("is-collapsed", !isCollapsed);

//     chevron.classList.toggle("rotated", isCollapsed);
//   };
// }

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
