import { z } from "zod";

const ID = z.union([z.string(), z.number()]);

export const IdAndName = z.object({ id: ID, name: z.string() });

export const User = z.object({ id: ID, username: z.string() });
export type User = z.infer<typeof User>;

export const Status = z.object({ status: z.string() });

export const Project = IdAndName;
export const Folder = IdAndName;

export const Space = IdAndName;
export type Space = z.infer<typeof Space>;

export const List = z.object({
  id: ID,
  name: z.string(),
  content: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  archived: z.boolean().optional(),
});

export type List = z.infer<typeof List>;

export const DateInMillis = z.preprocess(
  (value?: unknown) => {
    if (!value) {
      return undefined;
    }

    return new Date(Number(value)).toISOString();
  },
  z.string().optional(),
);

export const Task = z.object({
  name: z.string(),
  id: z.string(),
  custom_id: z.string().nullable(),
  description: z.string().nullable().optional(),
  status: Status,
  creator: User,
  assignees: z.array(User),
  watchers: z.array(User),
  date_created: DateInMillis,
  date_updated: DateInMillis,
  date_closed: DateInMillis.optional(),
  project: Project,
  folder: Folder,
  list: List,
});

export type Task = z.infer<typeof Task>;
