import "dotenv/config";
import Database from "better-sqlite3";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const MINIMUM_DURATION_SECONDS = 30;

type TimeRange = {
  start: string;
  end: string;
};

type RawActivity = {
  app: string | null;
  path: string | null;
  start: number;
  end: number;
};

type ActivitySummary = [string, string]; // [appAndPath, duration]

type HourlyBreakdown = {
  hours: Record<string, ActivitySummary[]>;
};

type DurationsByIdentifier = Record<string, number>;
type HourlyDurations = Record<string, DurationsByIdentifier>;

function getActivitiesFromDb(timeRange: TimeRange): RawActivity[] {
  const { TIME_ENTRIES_SQL_PATH } = process.env;

  if (TIME_ENTRIES_SQL_PATH === undefined) {
    throw new Error("TIME_ENTRIES_SQL_PATH environment variable must be set");
  }

  const db = new Database(TIME_ENTRIES_SQL_PATH);
  const query = db.prepare(`
    SELECT
      Application.title as app,
      Path.stringValue as path,
      AppActivity.startDate as start,
      AppActivity.endDate as end
    FROM AppActivity
    LEFT JOIN Path ON Path.id = AppActivity.pathID
    LEFT JOIN Application ON Application.id = AppActivity.applicationID
    WHERE AppActivity.isDeleted = 0
      AND AppActivity.startDate >= ?
      AND AppActivity.endDate <= ?
    ORDER BY AppActivity.startDate ASC
  `);

  const activities = query.all(
    dayjs(timeRange.start).unix(),
    dayjs(timeRange.end).unix(),
  ) as RawActivity[];

  db.close();
  return activities;
}

function formatActivityDuration(seconds: number): string {
  const d = dayjs.duration(seconds, "seconds");

  if (d.asMinutes() < 1) {
    return d.format("s[s]");
  }

  return d.format("H[h] m[m]").replace("0h ", "");
}

function getHourFromTimestamp(timestamp: number): string {
  return dayjs.unix(timestamp).format("HH:00");
}

function formatIdentifier(activity: RawActivity): string {
  const appName = activity.app ?? "Unknown";
  const pathSuffix = activity.path ? ` - ${activity.path}` : "";
  return `${appName}${pathSuffix}`;
}

function aggregateActivitiesByHour(activities: RawActivity[]): HourlyDurations {
  return activities.reduce<HourlyDurations>((hourMap, activity) => {
    const hour = getHourFromTimestamp(activity.start);
    const identifier = formatIdentifier(activity);
    const duration = activity.end - activity.start;
    const existingDuration = (hourMap[hour]?.[identifier] ?? 0) + duration;

    return {
      ...hourMap,
      [hour]: {
        ...hourMap[hour],
        [identifier]: existingDuration,
      },
    };
  }, {});
}

function createHourlyBreakdown(
  hourlyDurations: HourlyDurations,
): HourlyBreakdown {
  const summary: HourlyBreakdown = { hours: {} };

  for (const [hour, durationsByIdentifier] of Object.entries(hourlyDurations)) {
    const significantActivities = Object.entries(durationsByIdentifier)
      .filter(([, duration]) => duration >= MINIMUM_DURATION_SECONDS)
      .map(
        ([identifier, duration]): ActivitySummary => [
          identifier,
          formatActivityDuration(duration),
        ],
      );

    if (significantActivities.length > 0) {
      summary.hours[hour] = significantActivities;
    }
  }

  return summary;
}

function summarizeActivitiesByHour(activities: RawActivity[]): HourlyBreakdown {
  const hourlyDurations = aggregateActivitiesByHour(activities);
  return createHourlyBreakdown(hourlyDurations);
}

export function getHourlyActivitySummary(
  timeRange: TimeRange,
): HourlyBreakdown {
  const activities = getActivitiesFromDb(timeRange);
  return summarizeActivitiesByHour(activities);
}

const now = dayjs();
console.log(
  JSON.stringify(
    getHourlyActivitySummary({
      start: now.hour(9).startOf("hour").toISOString(),
      end: now.endOf("day").toISOString(),
    }),
    null,
    2,
  ),
);
