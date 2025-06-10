#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { getAllConversations, getMessages, getSlackUser } from "./slack";
import { ClickUpTasksAPIInputBody, getClickUpUser, getTasks } from "./clickup";
import { queryActivities } from "./timing";
import { getNow } from "./time";
import {
  createTimeEntry,
  getHarvestUser,
  getProjectAssignments,
} from "./harvest";
import { getAllRepositoriesReflogs, getLocalGitRepositories } from "./git";
import { getGitHubUser, getUserContributions } from "./github";
import {
  createCalendarEvent,
  getCalendarEvents,
  getGoogleUser,
  getGoogleDirectoryPeople,
  respondToCalendarEvent,
  ResponseStatus,
  getGoogleColors,
} from "./google";

const createToolResult = (result: unknown) => {
  return CallToolResultSchema.parse({
    content: [{ type: "text", text: JSON.stringify(result) }],
  });
};

const server = new McpServer({
  name: "activity-mcp",
  version: "1.0.0",
});

const start = async () => {
  const transport = new StdioServerTransport();

  server.tool(
    "getSlackUser",
    "Get currently authenticated Slack User information.",
    async () => {
      return createToolResult(await getSlackUser());
    },
  );

  server.tool(
    "getAllSlackConversations",
    "Get all available Slack conversations",
    {
      includeArchived: z
        .boolean()
        .describe(
          "Whether to include archived channels or not. Default to true",
        ),
      includeDirectMessages: z
        .boolean()
        .describe("Whether to include direct messages"),
      includeGroupMessages: z
        .boolean()
        .describe("Whether to include group messages"),
      includePublicChannels: z
        .boolean()
        .describe("Whether to include public channels"),
      includePrivateChannels: z
        .boolean()
        .describe("Whether to include private channels"),
    },
    async (params) => {
      return createToolResult(await getAllConversations(params));
    },
  );

  server.tool(
    "getSlackMessages",
    "Get Slack messages sent by the current user between two dates",
    {
      dayAfterRange: z
        .string()
        .describe(
          "Day in YYYY-MM-DD which comes after the desired date range. Ensure this is OUTSIDE your day range. eg. Day before -> ( Desired date range ) -> Day after.",
        ),
      dayBeforeRange: z
        .string()
        .describe(
          "Day in YYYY-MM-DD which comes before the desired date range. Ensure this is OUTSIDE your day range. eg. Day before -> ( Desired date range ) -> Day after.",
        ),
      page: z.number().describe("Page number. Starts at 1."),
      search: z
        .string()
        .describe(
          "Search query. Matches messages that contain all words included in.",
        )
        .optional(),
      channelNames: z
        .array(z.string())
        .describe("List of channel names to filter in.")
        .optional(),
      userIds: z
        .array(z.string())
        .describe("List of user IDs to filter to.")
        .optional(),
    },
    async (params) => {
      return createToolResult(await getMessages(params));
    },
  );

  server.tool(
    "getClickUpUser",
    "Get currently authenticated ClickUp User information.",
    async () => {
      return createToolResult(await getClickUpUser());
    },
  );

  server.tool(
    "getClickUpTasks",
    "Get ClickUp tasks",
    {
      page: z
        .number()
        .int()
        .describe("Page to fetch (starts at 0).")
        .optional(),
      assignees: z
        .array(z.string())
        .describe("List of assignee IDs to filter by.")
        .optional(),
      project_ids: z
        .array(z.string())
        .describe("List of project IDs to filter by.")
        .optional(),
      space_ids: z
        .array(z.string())
        .describe("List of space IDs to filter by.")
        .optional(),
      list_ids: z
        .array(z.string())
        .describe("List of list IDs to filter by.")
        .optional(),
      date_updated_gt: z
        .number()
        .int()
        .describe(
          "Filter by date updated greater than Unix time in milliseconds.",
        )
        .optional(),
      date_updated_lt: z
        .number()
        .int()
        .describe("Filter by date updated less than Unix time in milliseconds.")
        .optional(),
    },
    async (params: ClickUpTasksAPIInputBody) => {
      return createToolResult(await getTasks(params));
    },
  );

  await server.connect(transport);
};

server.tool(
  "queryActivities",
  "Get titles, applications, paths of all activities between two timestamps. Is paginated.",
  {
    start: z.number().describe("Lower bound timestamp in seconds."),
    end: z.number().describe("Upper bound timestamp in seconds."),
    limit: z.number().describe("SQLite LIMIT."),
    page: z.number().describe("SQLite OFFSET = SQLite LIMIT * page"),
  },
  (params) => {
    return createToolResult(queryActivities(params));
  },
);

server.tool(
  "getCurrentDateTime",
  "Get the current date & time. If in doubt, call this first.",
  () => {
    return createToolResult(getNow());
  },
);

server.tool(
  "getHarvestUser",
  "Get currently authenticated Slack User information.",
  async () => {
    return createToolResult(await getHarvestUser());
  },
);

server.tool(
  "getHarvestProjectAssignments",
  "Get all Harvest projects and their billables.",
  {
    page: z.number().describe("Page number, starts at 1."),
  },
  async (params) => {
    return createToolResult(await getProjectAssignments(params));
  },
);

server.tool(
  "createTimeEntry",
  "Create a time entry in Harvest",
  {
    project_id: z.number().describe("The project ID in Harvest."),
    task_id: z.number().describe("The task ID in Harvest."),
    spent_date: z.string().describe("Day in YYYY-MM-DD for time entry."),
    hours: z.number().describe("Spent hours as a number."),
    notes: z.string().describe("Description of time spent."),
  },
  async (params) => {
    return createToolResult(await createTimeEntry(params));
  },
);

server.tool(
  "getLocalGitRepositories",
  "Get all local git repositories.",
  async () => {
    return createToolResult(
      getLocalGitRepositories().map((dirent) => dirent.name),
    );
  },
);

server.tool(
  "getAllRepositoriesReflogs",
  "Get all available reflogs between two given dates.",
  {
    since: z.string().describe("YYYY-MM-DD HH:MM:SS lower bound of range."),
    until: z.string().describe("YYYY-MM-DD HH:MM:SS upper bound of range."),
    includeEmpty: z
      .boolean()
      .describe(
        "Whether to include repositories with no activity. Default to false.",
      ),
  },
  async (params) => {
    return createToolResult(await getAllRepositoriesReflogs(params));
  },
);

server.tool(
  "getGitHubUser",
  "Get currently authenticated username and name for GitHub.",
  async () => {
    return createToolResult(await getGitHubUser());
  },
);

server.tool(
  "getGitHubUserContributions",
  "Get pull requests, reviews, and commit counts by repository on GitHub",
  {
    username: z
      .string()
      .describe(
        "GitHub username for contributions. Use getGitHubUser under 'login' to see the current username.",
      ),
    from: z
      .string()
      .describe(
        "ISO datetime for start of date range. Sample: 2025-05-26T09:49:07Z",
      ),
    to: z
      .string()
      .describe(
        "ISO datetime for start of date range. Sample: 2025-05-26T09:49:07Z",
      ),
  },
  async (params) => {
    return createToolResult(await getUserContributions(params));
  },
);

server.tool(
  "getGoogleCalendarEvents",
  "Get events from Google Calendar.",
  {
    calendarId: z
      .string()
      .describe(
        "Calendar ID. To get the main calendar of the current user, use 'primary'.",
      ),
    timeMax: z
      .string()
      .describe(
        "Upper bound (exclusive) for an event's start time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset",
      ),
    timeMin: z
      .string()
      .describe(
        "Lower bound (exclusive) for an event's end time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset.",
      ),
    q: z
      .string()
      .optional()
      .describe(
        "Free text search terms to find events that match these terms in the following fields: summary, description, location, attendee's displayName, attendee's email.",
      ),
    pageToken: z
      .string()
      .optional()
      .describe("Token specifying which result page to return."),
  },
  async (params) => {
    return createToolResult(await getCalendarEvents(params));
  },
);

server.tool(
  "respondToGoogleCalendarEvent",
  "Update authorized user's response status for a given event. Returns the updated event.",
  {
    calendarId: z.string().describe("Calendar ID."),
    eventId: z
      .string()
      .optional()
      .describe(
        "Event ID to respond to. Always prefer to use recurringEventID if available, unless specified otherwise.",
      ),
    response: ResponseStatus.describe(
      "Status to respond with. One of declined, needsAction, accepted, or tentative",
    ),
  },
  async (params) => {
    return createToolResult(await respondToCalendarEvent(params));
  },
);

server.tool(
  "getGoogleUser",
  "Get name and email associated with the logged in user.",
  async () => {
    return createToolResult(await getGoogleUser());
  },
);

server.tool(
  "getGoogleDirectoryPeople",
  "Get names and email addresses for all people in the user's directory.",
  async () => {
    return createToolResult(await getGoogleDirectoryPeople());
  },
);

server.tool(
  "createGoogleCalendarEvent",
  "Create a new ",
  {
    calendarId: z.string().describe("The calendar ID."),
    attendeesEmails: z.string().array().describe("A list of attendees emails."),
    description: z.string().describe("The description of the event."),
    location: z.string().optional().describe("Where the event is. Optional."),
    remindersMinutes: z
      .number()
      .array()
      .describe(
        "Up to 5 numbers as minutes before the event to send a notification. Can send up to 4 weeks in advance.",
      ),
    fullDayEventStartDate: z
      .string()
      .optional()
      .describe("Start date in YYYY-MM-DD if this is an all-day event."),
    fullDayEventEndDate: z
      .string()
      .optional()
      .describe("End date in YYYY-MM-DD if this is an all-day event."),
    nonFullDayEventStartDateTime: z
      .string()
      .optional()
      .describe("RFC3339 date-time value if this is not an all-day event."),
    nonFullDayEventEndDateTime: z
      .string()
      .optional()
      .describe("RFC3339 date-time value if this is not an all-day event."),
    timeZone: z
      .string()
      .describe("IANA time zone for the event eg. Melbourne/Australia."),
    summary: z
      .string()
      .describe("The summary or title of the event. Appears on calendar."),
    recurrence: z
      .string()
      .array()
      .optional()
      .describe(
        "List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events.",
      ),
    colorId: z
      .string()
      .optional()
      .describe(
        "Color for the event, see colors tool for color IDs and their corresponding hex codes.",
      ),
  },
  async (params) => {
    return createToolResult(await createCalendarEvent(params));
  },
);

server.tool(
  "getGoogleCalendarColors",
  "Get a record of event color IDs to their hex codes.",
  async () => {
    return createToolResult(await getGoogleColors());
  },
);

start().catch(console.error);
