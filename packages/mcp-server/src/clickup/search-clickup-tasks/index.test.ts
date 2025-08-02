import { searchClickUpTasks } from ".";
import { getClickUpUser } from "../get-clickup-user";

const PARAMS = {
  date_updated_gt: "2025-07-29T00:00:00.000Z",
  date_updated_lt: "2025-07-29T10:00:00.000Z",
};

describe("searchClickUpTasks", () => {
  it("returns tasks", async () => {
    const result = await searchClickUpTasks(PARAMS);

    expect(result.tasks.length).toBeGreaterThan(0);
    expect(Object.keys(result.spaces).length).toBeGreaterThan(0);
    expect(Object.keys(result.users).length).toBeGreaterThan(0);
    expect(Object.keys(result.projects).length).toBeGreaterThan(0);
    expect(Object.keys(result.lists).length).toBeGreaterThan(0);
    expect(Object.keys(result.folders).length).toBeGreaterThan(0);
  });

  it("filters based on user", async () => {
    const { id: userId } = await getClickUpUser();

    const { tasks: allTasks } = await searchClickUpTasks(PARAMS);

    const { tasks: userTasks } = await searchClickUpTasks({
      ...PARAMS,
      assignees: [userId.toString()],
    });

    expect(userTasks.length).toBeLessThan(allTasks.length);
  });
});
