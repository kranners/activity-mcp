#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResult, CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { getMessagesFromUser } from "./slack";
import { getTasks } from "./clickup";
import { queryActivities } from "./timing";
import { getNowAsMillis, getNowAsSeconds, getNowAsYyyyMmDd } from "./time";
import { createTimeEntry, getMe, getProjectAssignments } from "./harvest";

const server = new McpServer({
  name: "activity-mcp",
  version: "1.0.0",
});

const start = async () => {
  const transport = new StdioServerTransport();

  server.tool(
    "getSlackMessages",
    "Get Slack messages sent by the current user between two dates",
    {
      before: z.string().describe("Day in YYYY-MM-DD BEFORE desired date range."),
      after: z.string().describe("Day in YYYY-MM-DD AFTER desired date range."),
    },
    async ({ before, after }): Promise<CallToolResult> => {
      const messages = await getMessagesFromUser({ before, after });

      return CallToolResultSchema.parse({
        content: [
          { type: "text", text: JSON.stringify(messages) }
        ]
      });
    },
  );

  server.tool(
    "getClickUpTasks",
    "Get ClickUp tasks",
    {
      dateUpdatedGt: z.number().describe("Number timestamp in millis. Lower bound for when the ticket was last updated."),
      dateUpdatedLt: z.number().describe("Number timestamp in millis. Upper bound for when the ticket was last updated."),
    },
    async ({ dateUpdatedGt, dateUpdatedLt }): Promise<CallToolResult> => {
      const tasks = await getTasks({ dateUpdatedGt, dateUpdatedLt });

      return CallToolResultSchema.parse({
        content: [
          { type: "text", text: JSON.stringify(tasks) }
        ]
      });
    },
  );

  await server.connect(transport);
};

server.tool(
  "queryActivities",
  "Get titles, applications, paths of all activities between two timestamps. Is paginated.",
  {
    start: z.number().describe("SQLite timestamp in seconds. Lower bound for the activity."),
    end: z.number().describe("SQLite timestamp in seconds. Upper bound for the activity."),
    limit: z.number().describe("SQLite LIMIT."),
    page: z.number().describe("SQLite OFFSET = SQLite LIMIT * page"),
  },
  ({ start, end, limit, page }): CallToolResult => {
    const activities = queryActivities({ start, end, limit, page });

    return CallToolResultSchema.parse({
      content: [
        { type: "text", text: JSON.stringify(activities) }
      ]
    });
  },
);

server.tool(
  "getCurrentTimeMillis",
  "Get the current time as a number timestamp in millis.",
  (): CallToolResult => ({ content: [{ type: "text", text: getNowAsMillis() }] })
);

server.tool(
  "getCurrentTimeSeconds",
  "Get the current time as a number timestamp in seconds.",
  (): CallToolResult => ({ content: [{ type: "text", text: getNowAsSeconds().toString() }] })
);

server.tool(
  "getCurrentTimeYyyyMmDd",
  "Get the current time in YYYY-MM-DD format.",
  (): CallToolResult => ({ content: [{ type: "text", text: getNowAsYyyyMmDd() }] })
);

server.tool(
  "getHarvestProjectAssignments",
  "Get all Harvest projects and their billables.",
  async (): Promise<CallToolResult> => ({
    content: [{ type: "text", text: await getProjectAssignments() }],
  })
);

server.tool(
  "getMe",
  "Get information about the authenticated user according to Harvest.",
  async (): Promise<CallToolResult> => ({
    content: [{ type: "text", text: await getMe() }],
  })
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
  async ({ project_id, task_id, spent_date, hours, notes }): Promise<CallToolResult> => ({
    content: [{
      type: "text", text: await createTimeEntry({
        project_id,
        task_id,
        spent_date,
        hours,
        notes,
      })
    }],
  })
);

start().catch(console.error);
