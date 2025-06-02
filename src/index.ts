#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { getAllChannels, getMessagesFromUser, getUserId } from "./slack";
import { ClickUpTasksAPIInputBody, getTasks } from "./clickup";
import { queryActivities } from "./timing";
import { getNowAsMillis, getNowAsSeconds, getNowAsYyyyMmDd } from "./time";
import { createTimeEntry, getMe, getProjectAssignments } from "./harvest";

const createToolResult = (result: unknown) =>
  CallToolResultSchema.parse({
    content: [{ type: "text", text: JSON.stringify(result) }],
  });

const server = new McpServer({
  name: "activity-mcp",
  version: "1.0.0",
});

const start = async () => {
  const transport = new StdioServerTransport();

  server.tool(
    "getSlackUserId",
    "Get currently authenticated users Slack User ID",
    async () => {
      return createToolResult(await getUserId());
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
      includePublicChannels: z
        .boolean()
        .describe("Whether to include public channels"),
      includePrivateChannels: z
        .boolean()
        .describe("Whether to include private channels"),
    },
    async (params) => {
      return createToolResult(await getAllChannels(params));
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
      return createToolResult(await getMessagesFromUser(params));
    },
  );

  server.tool(
    "getClickUpTasks",
    "Get ClickUp tasks",
    ClickUpTasksAPIInputBody,
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
  "getCurrentTimeMillis",
  "Get the current time as a number timestamp in millis.",
  () => {
    return createToolResult(getNowAsMillis());
  },
);

server.tool(
  "getCurrentTimeSeconds",
  "Get the current time as a number timestamp in seconds.",
  () => {
    return createToolResult(getNowAsSeconds());
  },
);

server.tool(
  "getCurrentTimeYyyyMmDd",
  "Get the current time in YYYY-MM-DD format.",
  () => {
    return createToolResult(getNowAsYyyyMmDd());
  },
);

server.tool(
  "getHarvestProjectAssignments",
  "Get all Harvest projects and their billables.",
  async () => {
    return createToolResult(await getProjectAssignments());
  },
);

server.tool(
  "getMe",
  "Get information about the authenticated user according to Harvest.",
  async () => {
    return createToolResult(await getMe());
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

start().catch(console.error);
