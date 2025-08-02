import { z } from "zod";

export const ID = z.union([z.number(), z.string()]);

export const User = z.object({ id: ID, username: z.string() });

export type User = z.infer<typeof User>;

export const Status = z.object({ status: z.string() });

export const Project = z.object({ id: ID, name: z.string() });

export const List = z.object({ id: ID, name: z.string() });

export const Folder = z.object({ id: ID, name: z.string() });

export const Space = z.object({ id: ID, name: z.string() });

export type Space = z.infer<typeof Space>;

export const DateInMillis = z.preprocess(
  (value: unknown) => new Date(Number(value)).toISOString(),
  z.string(),
);

export const Task = z.object({
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
  project: Project,
  folder: Folder,
  list: List,
  space: Space,
});

export type Task = z.infer<typeof Task>;
