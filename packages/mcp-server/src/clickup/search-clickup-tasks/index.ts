import { getTeamId, indexTasks, makePaginatedClickUpRequest, optionalIsoToOptionalMillis } from "../index.js";

export type ClickUpTasksAPIInputBody = {
  assignees?: string[];
  project_ids?: string[];
  space_ids?: string[];
  list_ids?: string[];
  date_updated_gt?: string;
  date_updated_lt?: string;
};

export const searchClickUpTasks = async (params: ClickUpTasksAPIInputBody) => {
  const tasks = await makePaginatedClickUpRequest(
    `/team/${getTeamId()}/task`,
    "tasks",
    {
      order_by: "updated",
      include_closed: true,
      include_markdown_description: true,

      ...params,

      date_updated_lt: optionalIsoToOptionalMillis(params.date_updated_lt),
      date_updated_gt: optionalIsoToOptionalMillis(params.date_updated_gt),
      team_Id: getTeamId(),
    },
  );

  return indexTasks(tasks);
};
