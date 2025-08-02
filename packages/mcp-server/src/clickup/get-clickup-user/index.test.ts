import { getClickUpUser } from ".";

describe("getClickUpUser", () => {
  it("can get the authenticated user", async () => {
    const user = await getClickUpUser();

    expect(user.id).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
  });
});
