import { z } from "zod";
import clickup from "@api/clickup";
import { auth } from "../auth";

const AuthorizedUser = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export const getClickUpUser = async () => {
  auth();

  const response = await clickup.getAuthorizedUser();
  const { user } = response.data;

  if (user === undefined) {
    throw new Error(
      "Was unable to read current ClickUp user. Please check your CLICKUP_TOKEN.",
    );
  }

  return AuthorizedUser.parse(user);
};
