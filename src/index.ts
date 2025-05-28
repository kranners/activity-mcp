#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResult, CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { getMessagesFromUser } from "./slack";
import { getTasks } from "./clickup";

const getNowAsYyyyMmDd = () => new Intl.DateTimeFormat('en-CA').format(new Date());

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

      const result = {
        content: [
          {
            type: "text",
            text: JSON.stringify(messages),
          }
        ]
      };

      return CallToolResultSchema.parse(result);
    },
  );

  server.tool(
    "getClickUpTasks",
    "Get ClickUp tasks",
    {
      teamId: z.number().describe("ClickUp team ID"),
      dateUpdatedGt: z.number().describe("Number timestamp in millis. Lower bound for when the ticket was last updated."),
      dateUpdatedLt: z.number().describe("Number timestamp in millis. Upper bound for when the ticket was last updated."),
    },
    async ({ teamId, dateUpdatedGt, dateUpdatedLt }): Promise<CallToolResult> => {
      const tasks = await getTasks({ teamId, dateUpdatedGt, dateUpdatedLt });

      const result = {
        content: [
          {
            type: "text",
            text: JSON.stringify(tasks),
          }
        ]
      };

      return CallToolResultSchema.parse(result);
    },
  );

  await server.connect(transport);
};

server.tool(
  "getCurrentTimeMillis",
  "Get the current time as a number timestamp in millis.",
  (): CallToolResult => ({ content: [{ type: "text", text: Date.now().toString() }] })
);

server.tool(
  "getCurrentTimeYyyyMmDd",
  "Get the current time in YYYY-MM-DD format.",
  (): CallToolResult => ({ content: [{ type: "text", text: getNowAsYyyyMmDd() }] })
);

start().catch(console.error);
