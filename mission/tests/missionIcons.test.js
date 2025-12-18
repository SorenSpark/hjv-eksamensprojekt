const { getTaskTypeIcon } = require("../missionIcons");

describe("getTaskTypeIcon", () => {
  it('returns "terrain" for "Land"', () => {
    expect(getTaskTypeIcon("Land")).toBe("terrain");
  });

  it('returns "water" for "Vand"', () => {
    expect(getTaskTypeIcon("Vand")).toBe("water");
  });

  it('returns "help" for other values', () => {
    expect(getTaskTypeIcon("Air")).toBe("help");
    expect(getTaskTypeIcon("Undefined")).toBe("help");
  });
});

//tester hver case i swtich statement
//tester logik - input'et "vand"s forventede output er water.
//hvis funktionen returnere vand er det derfor passed

// termer:
//describe blok: gruppere tests
//test ell it: en specifik test (input og output)
//expect() og toBe: vores forventede output
