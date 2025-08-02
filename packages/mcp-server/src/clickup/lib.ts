import "dotenv/config";

export const getTeamId = () => {
  const teamId = Number(process.env.CLICKUP_TEAM_ID);

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.");
  }

  return teamId;
};
