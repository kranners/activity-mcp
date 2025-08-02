import { GetFilteredTeamTasksMetadataParam } from "@api/clickup/types";
import { Space, Task, User } from "../models";
import { getTeamId, makeClickUpRequest } from "..";

export type ClickUpTasksAPIInputBody = {
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

  return new Date(iso).getTime().toString();
};

const buildTaskIndexer = async () => {
  const { spaces } = await makeClickUpRequest(`/team/${getTeamId()}/space`);

  const parseClickUpTasksResponse = (tasks: Task[]) => {
    return tasks.map((task) => {
      const taskSpace = spaces.find(
        (space: Space) => space.id === task.space?.id,
      );

      if (taskSpace !== undefined && task.space !== undefined) {
        task.space.name = taskSpace.name;
      }

      return Task.parse(task);
    });
  };

  return parseClickUpTasksResponse;
};

const indexTaskList = (tasks: Task[]) => {
  const spaces: Record<string, string> = {};
  const users: Record<string, string> = {};
  const projects: Record<string, string> = {};
  const lists: Record<string, string> = {};
  const folders: Record<string, string> = {};

  const recordUser = ({ id, username }: User) => {
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

export const searchClickUpTasks = async (params: ClickUpTasksAPIInputBody) => {
  const parseClickUpTasksResponse = await buildTaskIndexer();

  const purposelyDuplicatedParams = purposelyDuplicateListsInParams(
    params,
  ) as GetFilteredTeamTasksMetadataParam;

  let currentPage = 0;
  let isLastPage = false;
  const pages = [];

  while (isLastPage === false) {
    const { tasks = [], last_page } = await makeClickUpRequest(
      `/team/${getTeamId()}/task`,
      {
        ...purposelyDuplicatedParams,
        date_updated_lt: optionalIsoToOptionalMillis(params.date_updated_lt),
        date_updated_gt: optionalIsoToOptionalMillis(params.date_updated_gt),
        order_by: "updated",
        include_closed: true,
        include_markdown_description: true,
        team_Id: getTeamId(),
        page: currentPage,
      },
    );

    pages.push(tasks);
    isLastPage = last_page;
    currentPage++;
  }

  const joinedTasks = pages.flat();
  const tasks = parseClickUpTasksResponse(joinedTasks);

  return indexTaskList(tasks);
};
