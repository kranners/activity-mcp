import { z } from "zod";
import "dotenv/config";
import clickup from "@api/clickup";
import {
  GetFilteredTeamTasksMetadataParam,
  GetTasksResponse200,
} from "@api/clickup/types";

const auth = () => {
  if (process.env.CLICKUP_TOKEN === undefined) {
    throw new Error("CLICKUP_TOKEN must be set.");
  }

  clickup.auth(process.env.CLICKUP_TOKEN);
};

const ID = z.union([z.number(), z.string()]);

const User = z.object({ id: ID, username: z.string() });

const Status = z.object({ id: ID, status: z.string() });

const Project = z.object({ id: ID, name: z.string() });
const List = z.object({ id: ID, name: z.string() });
const Folder = z.object({ id: ID, name: z.string() });
const Space = z.object({ id: ID, name: z.string() });

export const Task = z.object({
  name: z.string(),
  custom_id: z.string().optional().nullable(),
  description: z.string().nullable(),
  status: Status,
  assignees: z.array(User),
  watchers: z.array(User),
  date_created: z.union([z.string(), z.number()]),
  date_updated: z.union([z.string(), z.number()]),
  url: z.string(),
  project: Project,
  folder: Folder,
  list: List,
  space: Space,
});

export const Tasks = z.array(Task);

export type ClickUpTasksAPIInputBody = {
  page?: number;
  assignees?: string[];
  project_ids?: string[];
  space_ids?: string[];
  list_ids?: string[];
  date_updated_gt?: string;
  date_updated_lt?: string;
};

// The ClickUp library thinks that if you pass an array with one string, that
// makes it just a string. So, if you want to filter by one thing, then you
// need to specify it twice.
const purposelyDuplicateListsInParams = (
  params: ClickUpTasksAPIInputBody,
): ClickUpTasksAPIInputBody => {
  params?.assignees?.push(params?.assignees?.[0]);
  params?.project_ids?.push(params?.project_ids?.[0]);
  params?.space_ids?.push(params?.space_ids?.[0]);
  params?.list_ids?.push(params?.list_ids?.[0]);

  return params;
};

const optionalIsoToOptionalMillis = (iso?: string) => {
  if (iso === undefined) {
    return;
  }

  return new Date(iso).getTime();
};

const getTeamId = () => {
  const teamId = Number(process.env.CLICKUP_TEAM_ID);

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.");
  }

  return teamId;
};

const getClickUpTaskParser = async () => {
  const spacesResponse = await clickup.getSpaces({
    order_by: "updated",
    team_id: getTeamId(),
  });

  const { spaces } = spacesResponse.data;

  const parseClickUpTasksResponse = (
    response: Awaited<ReturnType<typeof clickup.getFilteredTeamTasks>>,
  ) => {
    if (response.data.tasks === undefined) {
      return response.data;
    }

    const tasks = response.data.tasks.map((task) => {
      const taskSpace = spaces.find((space) => space.id === task.space?.id);

      if (taskSpace !== undefined && task.space !== undefined) {
        task.space.name = taskSpace.name;
      }

      return task;
    });

    return {
      tasks: Tasks.parse(tasks),
      last_page: response.data.last_page,
    };
  };

  return parseClickUpTasksResponse;
};

export const getClickUpTasks = async (params: ClickUpTasksAPIInputBody) => {
  auth();

  const taskParser = await getClickUpTaskParser();

  const purposelyDuplicatedParams = purposelyDuplicateListsInParams(
    params,
  ) as GetFilteredTeamTasksMetadataParam;

  let currentPage = 0;
  let isLastPage = false;
  const pages: ReturnType<typeof taskParser>[] = [];

  while (isLastPage === false) {
    const response = await clickup.getFilteredTeamTasks({
      ...purposelyDuplicatedParams,
      date_updated_lt: optionalIsoToOptionalMillis(params.date_updated_lt),
      date_updated_gt: optionalIsoToOptionalMillis(params.date_updated_gt),
      order_by: "updated",
      include_closed: true,
      include_markdown_description: true,
      team_Id: getTeamId(),
      page: currentPage,
    });

    const parsed = taskParser(response);

    pages.push(parsed);

    isLastPage = parsed.last_page as boolean;
    currentPage++;
  }

  const tasks = pages.map(({ tasks }) => tasks).flat();

  return {
    tasks,
    totalPages: currentPage,
  };
};

const ClickUpUser = z.object({
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

  return ClickUpUser.parse(user);
};

// getClickUpTasks({
//   date_updated_gt: "2025-06-05T00:00:00Z",
//   date_updated_lt: "2025-06-14T23:59:59Z",
// }).then((result) => console.log(JSON.stringify(result, null, 2)));
