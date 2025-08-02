import { z } from "zod";
import { makeClickUpRequest } from "../index.js";

const AuthorizedUser = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export const getClickUpUser = async () => {
  const { user } = await makeClickUpRequest("/user");

  if (user === undefined) {
    throw new Error(
      "Was unable to read current ClickUp user. Please check your CLICKUP_TOKEN.",
    );
  }

  return AuthorizedUser.parse(user);
};
