import { ChatOpenAI } from "@langchain/openai";
import { Logger, MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";

Logger.setDebug(1);

export const MCP_CLIENT_CONFIG = {
  mcpServers: {
    activity: {
      command: "node",
      args: ["--no-deprecation", "./dist/index.js"],
    },
  },
};

export const client = MCPClient.fromDict(MCP_CLIENT_CONFIG);
export const llm = new ChatOpenAI({ modelName: "gpt-4o" });

export const agent = new MCPAgent({
  llm,
  client,
  maxSteps: 30,
  verbose: true,
});

export const run = async (prompt: string) => {
  agent.clearConversationHistory();
  return agent.run(prompt);
};
