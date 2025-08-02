import clickup from "@api/clickup";
import { getTeamId } from "./lib";

const getSpaceIdFromTeam = async (teamId: number, spaceName: string) => {
  const response = await clickup.getSpaces({
    order_by: "updated",
    team_id: teamId,
  });

  const { spaces } = response.data;

  const space = spaces.find((space) => {
    return space.name === spaceName;
  });

  if (space === undefined) {
    return undefined;
  }

  const id = Number.parseInt(space.id);

  if (Number.isNaN(id)) {
    return undefined;
  }

  return id;
};

type GetSprintInput = {
  day?: string;
  space: string;
};

export const getSprint = ({
  day = new Date().toISOString(),
  space,
}: GetSprintInput) => {
  const spaceId = getSpaceIdFromTeam(getTeamId(), space);
};
