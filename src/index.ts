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

start().catch(console.error);
