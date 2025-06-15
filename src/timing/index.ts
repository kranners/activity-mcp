import "dotenv/config";
import Database from "better-sqlite3";

type Activity = {
  title: string | null;
  applicationTitle: string | null;
  path: string | null;
  startDate: number;
  endDate: number;
};

type QueryActivitiesInput = {
  start: number;
  end: number;
  page: number;
};

const QUERY_LIMIT = 200;

const ACTIVITY_QUERY = `
  SELECT
    Title.stringValue AS title,
    Application.title AS applicationTitle,
    Path.stringValue AS path,
    AppActivity.startDate,
    AppActivity.endDate
  FROM AppActivity
  LEFT JOIN Title ON Title.id = AppActivity.titleID
  LEFT JOIN Path ON Path.id = AppActivity.pathID
  LEFT JOIN Application ON Application.id = AppActivity.applicationID
  WHERE AppActivity.isDeleted = 0
    AND AppActivity.startDate <= ?
    AND AppActivity.endDate >= ?
  ORDER BY AppActivity.startDate ASC
  LIMIT ${QUERY_LIMIT} OFFSET ?
`;

const ACTIVITY_COUNT_QUERY = `
  SELECT COUNT(*) as total
  FROM AppActivity
  LEFT JOIN Title ON Title.id = AppActivity.titleID
  LEFT JOIN Path ON Path.id = AppActivity.pathID
  LEFT JOIN Application ON Application.id = AppActivity.applicationID
  WHERE AppActivity.isDeleted = 0
    AND AppActivity.startDate <= ?
    AND AppActivity.endDate >= ?
`;

export const getDesktopActivitiesForTimeRange = ({
  start,
  end,
  page,
}: QueryActivitiesInput) => {
  const dbPath = process.env.TIME_ENTRIES_SQL_PATH;

  if (dbPath === undefined) {
    throw new Error("TIME_ENTRIES_SQL_PATH must be set.");
  }

  const db = new Database(dbPath);

  const offset = QUERY_LIMIT * page;

  const activitiesStatement = db.prepare(ACTIVITY_QUERY);

  const activities = activitiesStatement.all(end, start, offset) as Activity[];

  const countStatement = db.prepare(ACTIVITY_COUNT_QUERY);
  const { total } = countStatement.get(end, start) as { total: number };

  db.close();

  return { total, activities };
};
