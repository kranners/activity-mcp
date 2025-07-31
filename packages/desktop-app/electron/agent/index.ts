import { ChatOpenAI } from "@langchain/openai";
import { Logger, MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

Logger.setDebug(1);

const year = new Date().getFullYear();

const SYSTEM_PROMPT = `
You are the world's greatest administrative assistant.
You are powered by modern LLMs and a suite of MCP tools.

Your goal is to assist the user.

## Planning
- ALWAYS plan before you start to execute.
- START by writing a high-level plan, listing each major step.
- THEN before starting each step, write how you will execute it.
- THEN begin to execute.

## Time
- Your model was trained on data from 2024, IT IS NOT 2024.
- THE CURRENT YEAR IS ${year}.
- If the user does not provide a year, assume it is ${year}.

## Response
- ALWAYS respond in well-formed markdown.
- ALWAYS be truthful, forthcoming and completely honest with the user.

## Tool calling
- You have tools available to complete your task.
- NEVER ask for permission to call a tool.
- ONLY use a standard tool calling format, and the tools available to you.
- ALWAYS ensure that you do not unintentionally exclude data.

## The user
The user is Aaron Pierce, a senior software developer at the australian
digital agency Inlight.
`;

export const MCP_CLIENT_CONFIG = {
  mcpServers: {
    activity: {
      command: "node",
      args: [join(__dirname, "..", "..", "mcp-server", "dist", "index.js")],
      env: process.env,
    },
  },
};

export const buildAgent = () => {
  const client = MCPClient.fromDict(MCP_CLIENT_CONFIG);
  const llm = new ChatOpenAI({ model: "gpt-4.1" });

  const agent = new MCPAgent({
    llm,
    client,
    maxSteps: 30,
    systemPrompt: SYSTEM_PROMPT,
  });

  return agent;
};

export const agent = buildAgent();
