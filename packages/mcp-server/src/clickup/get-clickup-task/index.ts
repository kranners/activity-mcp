import { makeClickUpRequest } from "../index.js";
import { Task } from "../models.js";

type GetTaskInput = {
  id: string;
};

export const getClickUpTask = async ({ id }: GetTaskInput) => {
  return Task.parse(
    await makeClickUpRequest(`/task/${id}`, { custom_task_ids: true }),
  );
};
