import { getClickUpSprint } from "."

describe("getSprint", () => {
  it("can get the current sprint", async () => {
    const sprint = await getClickUpSprint({ space: "Autobots" });

    expect(sprint.name).toBeDefined();
    expect(sprint.id).toBeDefined();
    expect(sprint.view.tasks.length).toBeGreaterThan(0);
  })
})
