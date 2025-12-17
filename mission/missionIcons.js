//Her tjekker vi hvilket environment missionen er i, og sætter passende ikon ind

export function getTaskTypeIcon(env) {
  switch (env) {
    case "Land":
      return "terrain";
    case "Vand":
      return "water";
    default:
      return "help";
  }
}
