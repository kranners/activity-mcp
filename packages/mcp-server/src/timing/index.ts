import "dotenv/config";
import Database from "better-sqlite3";

import { TZ_OFFSET_IN_SECONDS } from "../time/index.js";

type Activity = {
  title: string | null;
  app: string | null;
  path: string | null;
  start: number;
  end: number;
};

type QueryActivitiesInput = {
  start: string;
  end: string;
};

const ACTIVITY_QUERY = `
  SELECT
    Title.stringValue AS title,
    Application.title AS app,
    Path.stringValue AS path,
    AppActivity.startDate AS start,
    AppActivity.endDate AS end
  FROM AppActivity
  LEFT JOIN Title ON Title.id = AppActivity.titleID
  LEFT JOIN Path ON Path.id = AppActivity.pathID
  LEFT JOIN Application ON Application.id = AppActivity.applicationID
  WHERE AppActivity.isDeleted = 0
    AND AppActivity.startDate >= ?
    AND AppActivity.endDate <= ?
  ORDER BY AppActivity.startDate ASC
`;

const isoToSeconds = (iso: string) => {
  return new Date(iso).getTime() / 1000;
};

const localSecondsToUtcIso = (seconds: number) => {
  const millis = (seconds - TZ_OFFSET_IN_SECONDS) * 1000;
  return new Date(millis).toISOString();
};

const parseActivity = (activity: Activity) => {
  return {
    ...activity,
    start: localSecondsToUtcIso(activity.start),
    end: localSecondsToUtcIso(activity.end),
  };
};

export const getDesktopActivitiesForTimeRange = ({
  start,
  end,
}: QueryActivitiesInput) => {
  const dbPath = process.env.TIME_ENTRIES_SQL_PATH;

  if (dbPath === undefined) {
    throw new Error("TIME_ENTRIES_SQL_PATH must be set.");
  }

  const db = new Database(dbPath);

  const activitiesStatement = db.prepare(ACTIVITY_QUERY);

  const startSeconds = isoToSeconds(start);
  const endSeconds = isoToSeconds(end);

  const activities = activitiesStatement.all(
    startSeconds,
    endSeconds,
  ) as Activity[];

  db.close();

  return activities.map(parseActivity);
};
