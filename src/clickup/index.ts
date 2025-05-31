import 'dotenv/config';
import clickup from '@api/clickup';

const auth = () => {
  if (process.env.CLICKUP_TOKEN === undefined) {
    throw new Error("CLICKUP_TOKEN must be set.")
  }

  clickup.auth(process.env.CLICKUP_TOKEN);
}

type GetTasksInput = {
  dateUpdatedGt: number;
  dateUpdatedLt: number;
};

export const getTasks = async ({
  dateUpdatedGt, dateUpdatedLt
}: GetTasksInput) => {
  auth();

  const currentUser = await clickup.getAuthorizedUser();
  const currentUserId = currentUser.data.user?.id;

  const teamId = Number(process.env.CLICKUP_TEAM_ID);

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.")
  }

  if (currentUserId === undefined) {
    throw new Error("Was unable to read current ClickUp user. Please check your CLICKUP_TOKEN.");
  }

  const response = await clickup.getFilteredTeamTasks({
    order_by: 'updated',
    // assignees: [currentUserId.toString(), currentUserId.toString()],
    date_updated_gt: dateUpdatedGt,
    date_updated_lt: dateUpdatedLt,
    team_Id: teamId,
  });

  return response.data.tasks;
};

