import { searchClickUpTasks } from ".";
import { getClickUpUser } from "../get-clickup-user";

describe("searchClickUpTasks", () => {
  it("returns tasks", async () => {
    const result = await searchClickUpTasks({
      date_updated_gt: "2025-07-29T00:00:00.000Z",
      date_updated_lt: "2025-07-29T10:00:00.000Z",
    });

    expect(result.tasks.length).toBeGreaterThan(0);
    expect(Object.keys(result.spaces).length).toBeGreaterThan(0);
    expect(Object.keys(result.users).length).toBeGreaterThan(0);
    expect(Object.keys(result.projects).length).toBeGreaterThan(0);
    expect(Object.keys(result.lists).length).toBeGreaterThan(0);
    expect(Object.keys(result.folders).length).toBeGreaterThan(0);
  });

  it.only("filters based on user", async () => {
    const { id: userId } = await getClickUpUser();

    const { tasks: allTasks } = await searchClickUpTasks({
      date_updated_gt: "2025-07-29T00:00:00.000Z",
      date_updated_lt: "2025-07-29T10:00:00.000Z",
    });

    const { tasks: userTasks } = await searchClickUpTasks({
      date_updated_gt: "2025-07-29T00:00:00.000Z",
      date_updated_lt: "2025-07-29T10:00:00.000Z",
      assignees: [userId.toString()],
    });

    console.log(
      `Got ${allTasks.length} tasks total, ${userTasks.length} tasks when filtered`,
    );

    expect(userTasks.length).toBeLessThan(allTasks.length);
  });
});
