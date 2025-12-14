// 1. Modtag alle missioner i scenariet (fra Maja)
// Modtag liste med alle missioner
// Hver mission har status: locked, active og completed
//Men her er de vel alle locked fra start? og det skal jeg bygge ind i objektet??
// Gem alle missioner i missionList
// Laveste ID ligger øverst i listen

// 2. Vis missioner i UI
//For hver mission i missionList
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
