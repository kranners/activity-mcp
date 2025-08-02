import dayjs from "dayjs";
import { ClickUpResponse, getTeamId, indexTasks, makeClickUpRequest, makePaginatedClickUpRequest } from "../index.js";
import { List, Task } from "../models.js";

const getIdFromNamedResource = async (
  path: string,
  resourceKey: string,
  resourceName: string,
) => {
  const response: ClickUpResponse = await makeClickUpRequest(path, { archived: false });

  console.dir({ response });

  const resource = response[resourceKey].find((resource) => {
    return resource.name === resourceName;
  });

  return resource?.id;
};

export type GetSprintInput = {
  day?: string;
  space: string;
};

export const getClickUpSprint = async ({
  day,
  space,
}: GetSprintInput) => {
  const spaceId = await getIdFromNamedResource(
    `/team/${getTeamId()}/space`,
    "spaces",
    space,
  );

  const folderId = await getIdFromNamedResource(
    `/space/${spaceId}/folder`,
    "folders",
    "Sprints 🏃🏽‍♂️",
  );

  const archivedListsPromise = makeClickUpRequest(
    `/folder/${folderId}/list`,
    { archived: true }
  );

  const currentListsPromise = makeClickUpRequest(
    `/folder/${folderId}/list`,
    { archived: false }
  );

  const lists = await Promise.all([archivedListsPromise, currentListsPromise]).then(([
    archivedListsResponse, currentListsResponse
  ]) => {
    const archivedLists = archivedListsResponse.lists.map((list) => List.parse(list));
    const currentLists = currentListsResponse.lists.map((list) => List.parse(list));

    return [...archivedLists, ...currentLists];
  });

  const millis = dayjs(day).unix() * 1000;

  const list = lists.find((list) => {
    const start_date = Number(list.start_date);
    const due_date = Number(list.due_date);

    return start_date <= millis && due_date >= millis;
  });

  console.log({ spaceId, folderId, lists, list });

  if (list === undefined) {
    throw new Error(`No sprint found for day ${day}`);
  }

  const viewId = (await makeClickUpRequest(`/list/${list.id}/view`)).required_views.list.id;
  const tasks = await makePaginatedClickUpRequest(`/view/${viewId}/task`, "tasks");
  console.log({ spaceId, folderId, lists, list, tasks });
  const parsedTasks = tasks.map((task) => Task.parse(task));

  console.dir(parsedTasks);

  return {
    ...list,
    view: indexTasks(parsedTasks),
  };
};
