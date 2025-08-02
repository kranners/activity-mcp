import clickup from "@api/clickup";

export const auth = () => {
  if (process.env.CLICKUP_TOKEN === undefined) {
    throw new Error("CLICKUP_TOKEN must be set.");
  }

  clickup.auth(process.env.CLICKUP_TOKEN);
};
