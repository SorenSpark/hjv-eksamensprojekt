import { getTaskTypeIcon } from "../mission/missionIcons.js";

describe("getTaskTypeIcon", () => {
  test("returnerer 'water' når env er Vand", () => {
    expect(getTaskTypeIcon("Vand")).toBe("water");
  });

  test("returnerer 'terrain' når env er Land", () => {
    expect(getTaskTypeIcon("Land")).toBe("terrain");
  });

  test("returnerer fallback 'help' ved ukendt env", () => {
    expect(getTaskTypeIcon("Luft")).toBe("help");
  });
});
