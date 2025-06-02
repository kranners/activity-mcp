import Database from "better-sqlite3";

type ActivityResult = {
  title: string | null;
  applicationTitle: string | null;
  path: string | null;
  startDate: number;
  endDate: number;
};

type ActivityPage = {
  total: number;
  data: ActivityResult[];
};

type QueryActivitiesInput = {
  start: number;
  end: number;
  limit: number;
  page: number;
};

export const queryActivities = ({
  start,
  end,
  limit,
  page,
}: QueryActivitiesInput): ActivityPage => {
  const dbPath = process.env.TIME_ENTRIES_SQL_PATH;
  const db = new Database(dbPath, { readonly: true });
  const offset = limit * page;

  // Query for paginated data
  const dataSql = `
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
    LIMIT ? OFFSET ?
  `;
  const dataStmt = db.prepare(dataSql);
  const data = dataStmt.all(end, start, limit, offset) as ActivityResult[];

  // Query for total count (without LIMIT/OFFSET)
  const countSql = `
    SELECT COUNT(*) as total
    FROM AppActivity
    LEFT JOIN Title ON Title.id = AppActivity.titleID
    LEFT JOIN Path ON Path.id = AppActivity.pathID
    LEFT JOIN Application ON Application.id = AppActivity.applicationID
    WHERE AppActivity.isDeleted = 0
      AND AppActivity.startDate <= ?
      AND AppActivity.endDate >= ?
  `;
  const countStmt = db.prepare(countSql);
  const countRow = countStmt.get(end, start) as { total: number };
  const total = countRow.total;

  db.close();
  return { total, data };
};
