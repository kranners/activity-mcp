import { Space, Task, User } from "../models";
import { getTeamId, makeClickUpRequest, makePaginatedClickUpRequest } from "..";

export type ClickUpTasksAPIInputBody = {
  assignees?: string[];
  project_ids?: string[];
  space_ids?: string[];
  list_ids?: string[];
  date_updated_gt?: string;
  date_updated_lt?: string;
};

const optionalIsoToOptionalMillis = (iso?: string) => {
  if (iso === undefined) {
    return;
  }

  return new Date(iso).getTime().toString();
};

const buildTaskToSpaceJoiner = async () => {
  const { spaces } = await makeClickUpRequest(`/team/${getTeamId()}/space`);

  const joinTasksToTheirSpace = (tasks: Task[]) => {
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

  return joinTasksToTheirSpace;
};

const indexTasks = (tasks: Task[]) => {
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

  const joinTasksToTheirSpace = await buildTaskToSpaceJoiner();
  const parsed = indexTasks(joinTasksToTheirSpace(tasks));

  return parsed;
};
