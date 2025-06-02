import { z } from "zod";
import "dotenv/config";
import clickup from "@api/clickup";
import { GetFilteredTeamTasksMetadataParam } from "@api/clickup/types";

const auth = () => {
  if (process.env.CLICKUP_TOKEN === undefined) {
    throw new Error("CLICKUP_TOKEN must be set.");
  }

  clickup.auth(process.env.CLICKUP_TOKEN);
};

const ID = z.union([z.number(), z.string()]);

const User = z.object({
  id: ID,
  username: z.string(),
});

const Status = z.object({
  id: ID,
  status: z.string(),
});

const Project = z.object({
  id: ID,
  name: z.string(),
});

const List = z.object({
  id: ID,
  name: z.string(),
});

const Folder = z.object({
  id: ID,
  name: z.string(),
});

const Space = z.object({
  id: ID,
  name: z.string(),
});

export const Task = z.object({
  name: z.string(),
  description: z.string().nullable(),
  status: Status,
  assignees: z.array(User),
  date_created: z.union([z.string(), z.number()]),
  date_updated: z.union([z.string(), z.number()]),
  url: z.string(),
  project: Project,
  folder: Folder,
  list: List,
  space: Space,
});

export const Tasks = z.array(Task);

export const ClickUpTasksAPIInputBody = {
  page: z.number().int().describe("Page to fetch (starts at 0).").optional(),
  assignees: z
    .array(z.string())
    .describe("List of assignee IDs to filter by.")
    .optional(),
  project_ids: z
    .array(z.string())
    .describe("List of project IDs to filter by.")
    .optional(),
  space_ids: z
    .array(z.string())
    .describe("List of space IDs to filter by.")
    .optional(),
  list_ids: z
    .array(z.string())
    .describe("List of list IDs to filter by.")
    .optional(),
  date_updated_gt: z
    .number()
    .int()
    .describe("Filter by date updated greater than Unix time in milliseconds.")
    .optional(),
  date_updated_lt: z
    .number()
    .int()
    .describe("Filter by date updated less than Unix time in milliseconds.")
    .optional(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ClickUpTasksAPIInputBodySchema = z.object(ClickUpTasksAPIInputBody);

export type ClickUpTasksAPIInputBody = z.infer<
  typeof ClickUpTasksAPIInputBodySchema
>;

// The ClickUp library thinks that if you pass an array with one string, that
// makes it just a string. So, if you want to filter by one thing, then you
// need to specify it twice.
const processParams = (
  params: ClickUpTasksAPIInputBody,
): ClickUpTasksAPIInputBody => {
  params?.assignees?.push(params?.assignees?.[0]);
  params?.project_ids?.push(params?.project_ids?.[0]);
  params?.space_ids?.push(params?.space_ids?.[0]);
  params?.list_ids?.push(params?.list_ids?.[0]);

  return params;
};

export const getTasks = async (params: ClickUpTasksAPIInputBody) => {
  auth();

  const currentUser = await clickup.getAuthorizedUser();
  const currentUserId = currentUser.data.user?.id;

  const teamId = Number(process.env.CLICKUP_TEAM_ID);

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.");
  }

  if (currentUserId === undefined) {
    throw new Error(
      "Was unable to read current ClickUp user. Please check your CLICKUP_TOKEN.",
    );
  }

  const spacesResponse = await clickup.getSpaces({
    order_by: "updated",
    team_id: teamId,
  });

  const { spaces } = spacesResponse.data;

  const response = await clickup.getFilteredTeamTasks({
    ...(processParams(params) as GetFilteredTeamTasksMetadataParam),
    order_by: "updated",
    team_Id: teamId,
  });

  const tasks = response.data.tasks.map((task) => {
    const taskSpace = spaces.find((space) => space.id === task.space.id);

    if (taskSpace !== undefined) {
      task.space.name = taskSpace.name;
    }

    return task;
  });

  return Tasks.parse(tasks);
};
