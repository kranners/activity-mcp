import { searchClickUpTasks } from ".";

describe("searchClickUpTasks", () => {
  it("returns tasks", async () => {
    const result = await searchClickUpTasks({
      date_updated_gt: "2025-07-29T00:00:00.000Z",
      date_updated_lt: "2025-07-29T17:00:00.000Z",
    });

    expect(result.tasks.length).toBeGreaterThan(0);
    expect(Object.keys(result.spaces).length).toBeGreaterThan(0);
    expect(Object.keys(result.users).length).toBeGreaterThan(0);
    expect(Object.keys(result.projects).length).toBeGreaterThan(0);
    expect(Object.keys(result.lists).length).toBeGreaterThan(0);
    expect(Object.keys(result.folders).length).toBeGreaterThan(0);
  });
});
