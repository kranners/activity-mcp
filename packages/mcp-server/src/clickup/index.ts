import "dotenv/config";
import { Task, User } from "./models.js";

export const getTeamId = () => {
  const teamId = process.env.CLICKUP_TEAM_ID;

  if (teamId === undefined || Number.isNaN(teamId)) {
    throw new Error("CLICKUP_TEAM_ID must be set to a number.");
  }

  return teamId;
};

const removeUndefinedKeyValues = (
  params?: Record<string, unknown | undefined>,
) => {
  if (params === undefined) {
    return {};
  }

  const filtered = Object.entries(params)
    .filter(([, value]) => {
      return value !== undefined;
    })
    .map(([key, value]) => {
      return [key, String(value)];
    });

  return Object.fromEntries(filtered);
};

const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";

export type ClickUpResponse = {
  [key: string]: any[] & Record<string, any> & boolean,
};

export const optionalIsoToOptionalMillis = (iso?: string) => {
  if (iso === undefined) {
    return;
  }

  return new Date(iso).getTime().toString();
};

export async function makeClickUpRequest(
  path: string,
  params?: Record<string, unknown | undefined>,
  options?: Partial<RequestInit>,
) {
  if (
    process.env.CLICKUP_TOKEN === undefined ||
    process.env.CLICKUP_TEAM_ID === undefined
  ) {
    throw new Error("CLICKUP_TOKEN and CLICKUP_TEAM_ID must be set.");
  }

  const parsedParams = new URLSearchParams(removeUndefinedKeyValues(params));

  const response = await fetch(
    `${CLICKUP_API_BASE_URL}${path}?${parsedParams}`,
    {
      method: "GET",

      ...options,

      headers: {
        accept: "application/json",
        Authorization: process.env.CLICKUP_TOKEN,
        ...options?.headers,
      },
    },
  );

  return await response.json() as ClickUpResponse;
}

export const indexTasks = (tasks: Task[]) => {
  const users: Record<string, string> = {};
  const projects: Record<string, string> = {};
  const lists: Record<string, string> = {};
  const folders: Record<string, string> = {};

  const recordUser = ({ id, username }: User) => {
    users[id] = username;
    return username;
  };

  const strippedTasks = tasks.map((task) => {
    projects[task.project.id] = task.project.name;
    lists[task.list.id] = task.list.name;
    folders[task.folder.id] = task.folder.name;

    return {
      ...task,
      status: task.status.status,
      project: task.project.name,
      list: task.list.name,
      folder: task.folder.name,
      creator: recordUser(task.creator),
      assignees: task.assignees.map(recordUser),
      watchers: task.watchers.map(recordUser),
    };
  });

  return { users, projects, lists, folders, tasks: strippedTasks };
};

export const makePaginatedClickUpRequest = async (
  path: string,
  resultKey: string,
  params?: Record<string, unknown | undefined>,
) => {
  let currentPage = 0;
  let isLastPage = false;
  const pages: any[] = [];

  while (isLastPage === false) {
    const { last_page, ...rest } = await makeClickUpRequest(path, {
      ...params,
      page: currentPage,
    });

    pages.push(rest[resultKey] ?? []);

    isLastPage = last_page;
    currentPage++;
  }

  return pages.flat();
};
