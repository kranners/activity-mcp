#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  // getAllConversations,
  getMessages as getSlackMessages,
  getSlackUser,
} from "./slack/index.js";
import {
  ClickUpTasksAPIInputBody,
  getClickUpUser,
  getClickUpTasks,
} from "./clickup/index.js";
import { getDesktopActivitiesForTimeRange } from "./timing/index.js";
import { getTime } from "./time/index.js";
import {
  createTimeEntry,
  getHarvestUser,
  getProjectAssignments,
} from "./harvest/index.js";
import {
  getAllRepositoriesReflogs,
  getLocalGitRepositories,
} from "./git/index.js";
import { getGitHubUser, getUserContributions } from "./github/index.js";
import {
  createCalendarEvent,
  getCalendarEvents,
  getGoogleUser,
  getGoogleDirectoryPeople,
  respondToCalendarEvent,
  ResponseStatus,
  getGoogleColors,
} from "./google/index.js";

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

  // server.tool(
  //   "getAllSlackConversations",
  //   "Get all available Slack conversations",
  //   {
  //     includeArchived: z
  //       .boolean()
  //       .describe(
  //         "Whether to include archived channels or not. Default to true",
  //       ),
  //     includeDirectMessages: z
  //       .boolean()
  //       .describe("Whether to include direct messages"),
  //     includeGroupMessages: z
  //       .boolean()
  //       .describe("Whether to include group messages"),
  //     includePublicChannels: z
  //       .boolean()
  //       .describe("Whether to include public channels"),
  //     includePrivateChannels: z
  //       .boolean()
  //       .describe("Whether to include private channels"),
  //   },
  //   async (params) => {
  //     return createToolResult(await getAllConversations(params));
  //   },
  // );

  server.tool(
    "getSlackMessages",
    "Get Slack messages on a particular date range. Can filter to messages sent in particular channels, sent by particular users, or that contain a particular substring. To get messages on a single day, call both tools with the same day.",
    {
      dateRangeEnd: z
        .string()
        .describe("YYYY-MM-DD for when the date range should start"),
      dateRangeStart: z
        .string()
        .describe("YYYY-MM-DD for when the date range should end"),
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
      const response = await getSlackMessages(params);
      return createToolResult(response);
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
    "Get ClickUp tasks.",
    {
      assignees: z
        .array(z.string())
        .describe(
          "Filter to ONLY tickets where given user IDs are the ASSIGNEE.",
        )
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
        .string()
        .describe("ISO timestamp for minimum updated time to filter tickets to")
        .optional(),
      date_updated_lt: z
        .string()
        .describe("ISO timestamp for maximum updated time to filter tickets to")
        .optional(),
    },
    async (params: ClickUpTasksAPIInputBody) => {
      return createToolResult(await getClickUpTasks(params));
    },
  );

  await server.connect(transport);
};

server.tool(
  "getDesktopActivitiesForTimeRange",
  "Retrieves an array of desktop activities. They contain a start and end ISO string, an application, the title as it appears in MacOS, and a path like an internal value. Often a website, screen, or page.",
  {
    start: z.string().describe("Lower bound of the time range as ISO"),
    end: z.string().describe("Upper bound of the time range as ISO"),
  },
  (params) => {
    return createToolResult(getDesktopActivitiesForTimeRange(params));
  },
);

server.tool(
  "getDateTime",
  "Get current date and time in YYYY-MM-DD, ISO, timestamps in milliseconds and seconds, and the current timezone.",
  () => {
    return createToolResult(getTime());
  },
);

server.tool(
  "getHarvestUser",
  "Get currently authenticated Harvest user information.",
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
  "Get events from Google Calendar. If this tool contains a nextPageToken, then there are more pages of data available.",
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
    attendeeEmail: z
      .string()
      .optional()
      .describe(
        "Optionally filter to a single attendee. Prefer to do this with the email address from getGoogleUser.",
      ),
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
  "Create a new calendar event, it can be recurring or non-recurring.",
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
