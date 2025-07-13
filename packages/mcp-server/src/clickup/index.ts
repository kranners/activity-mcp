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

const User = z.object({ id: ID, username: z.string() });

const Status = z.object({ status: z.string() });

const Project = z.object({ id: ID, name: z.string() });
const List = z.object({ id: ID, name: z.string() });
const Folder = z.object({ id: ID, name: z.string() });
const Space = z.object({ id: ID, name: z.string() });

const DateInMillis = z.preprocess(
  (value: unknown) => new Date(Number(value)).toISOString(),
  z.string(),
);

const Task = z.object({
  name: z.string(),
  custom_id: z.string().nullable(),
  description: z.string().nullable(),
  status: Status,
  creator: User,
  assignees: z.array(User),
  watchers: z.array(User),
  date_created: DateInMillis,
  date_updated: DateInMillis,
  date_closed: DateInMillis,
  url: z.string(),
  project: Project,
  folder: Folder,
  list: List,
  space: Space,
});

const Tasks = z.array(Task);

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

type ClickUpTasksResponse = Awaited<
  ReturnType<typeof clickup.getFilteredTeamTasks>
>;

const getConnectClickupTaskToSpaces = async () => {
  const spacesResponse = await clickup.getSpaces({
    order_by: "updated",
    team_id: getTeamId(),
  });

  const { spaces } = spacesResponse.data;
  const parseClickUpTasksResponse = (
    tasks: ClickUpTasksResponse["data"]["tasks"],
  ) => {
    return tasks.map((task) => {
      const taskSpace = spaces.find((space) => space.id === task.space?.id);

      if (taskSpace !== undefined && task.space !== undefined) {
        task.space.name = taskSpace.name;
      }

      return Task.parse(task);
    });
  };

  return parseClickUpTasksResponse;
};

const indexTaskList = (tasks: z.infer<typeof Task>[]) => {
  const spaces: Record<string, string> = {};
  const users: Record<string, string> = {};
  const projects: Record<string, string> = {};
  const lists: Record<string, string> = {};
  const folders: Record<string, string> = {};

  const recordUser = ({ id, username }: z.infer<typeof User>) => {
    users[id] = username;
    return username;
  };

  const strippedTasks = tasks.map((task) => {
    spaces[task.space.id] = task.space.name;
    projects[task.project.id] = task.project.name;
    lists[task.list.id] = task.list.name;
    folders[task.folder.id] = task.folder.name;

    return {
      ...task,
      status: task.status.status,
      project: task.project.name,
      space: task.space.name,
      list: task.list.name,
      folder: task.folder.name,
      creator: recordUser(task.creator),
      assignees: task.assignees.map(recordUser),
      watchers: task.watchers.map(recordUser),
    };
  });

  return { spaces, users, projects, lists, folders, tasks: strippedTasks };
};

export const getClickUpTasks = async (params: ClickUpTasksAPIInputBody) => {
  auth();

  const parseClickUpTasksResponse = await getConnectClickupTaskToSpaces();

  const purposelyDuplicatedParams = purposelyDuplicateListsInParams(
    params,
  ) as GetFilteredTeamTasksMetadataParam;

  let currentPage = 0;
  let isLastPage = false;
  const pages: ClickUpTasksResponse["data"]["tasks"][] = [];

  while (isLastPage === false) {
    const { data: page } = await clickup.getFilteredTeamTasks({
      ...purposelyDuplicatedParams,
      date_updated_lt: optionalIsoToOptionalMillis(params.date_updated_lt),
      date_updated_gt: optionalIsoToOptionalMillis(params.date_updated_gt),
      order_by: "updated",
      include_closed: true,
      include_markdown_description: true,
      team_Id: getTeamId(),
      page: currentPage,
    });

    pages.push(page.tasks);
    isLastPage = page.last_page as boolean;
    currentPage++;
  }

  const joinedTasks = pages.flat();
  const tasks = parseClickUpTasksResponse(joinedTasks);

  return indexTaskList(tasks);
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
