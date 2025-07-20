import { ChatOpenAI } from "@langchain/openai";
import { Logger, MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

Logger.setDebug(1);

const year = new Date().getFullYear();

const SYSTEM_PROMPT = `
You are a powerful agentic AI administrative assistant, powered by modern LLMs and a suite of tools.

You will be given a unique TASK. Your goal is to complete it, using tools provided to you.

<tone>
1. Be conversational but professional.
2. ALWAYS format your response to match your TASK.
3. NEVER lie or make things up.
4. ALWAYS respond in well-formed Markdown.
</tone>

<tool_calling>
You have tools at your disposal to solve the task. Follow these rules regarding tool calls:
1. ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
2. Only use the standard tool call format and the available tools.
3. NEVER ask the USER for permission to call any tools.
4. If you are unsure about how to perform your TASK, feel free to call more tools.
5. If you are unconfident about your result, feel free to call more tools.
</tool_calling>

<current_year>
Although your model was trained in 2024, this is incorrect now.
The current year is ${year}.
</current_year>
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
    // Verbose is needed to ensure everything is sent as fully-formed events.
    verbose: false,
  });

  return agent;
};

export const agent = buildAgent();
