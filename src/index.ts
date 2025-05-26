#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CallToolResult, CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { getMessagesFromUser, getUserId } from "./slack";

const server = new McpServer({
  name: "activity-mcp",
  version: "1.0.0",
});

const start = async () => {
  const transport = new StdioServerTransport();

  server.tool(
    "getSlackUserId",
    "Get currently authenticated Slack user ID",
    async (): Promise<CallToolResult> => {
      const userId = await getUserId();

      const result = { content: [{ type: "text", text: userId, }] };

      return CallToolResultSchema.parse(result);
    },
  );

  server.tool(
    "getMessages",
    "Get messages sent by a user between two dates",
    {
      userId: z.string().describe("Slack user ID of user who sent the messages."),
      before: z.string().describe("Day in YYYY-MM-DD BEFORE desired date range."),
      after: z.string().describe("Day in YYYY-MM-DD AFTER desired date range."),
    },
    async ({ userId, before, after }): Promise<CallToolResult> => {
      const messages = await getMessagesFromUser({ userId, before, after });

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

  await server.connect(transport);
};

start().catch(console.error);
