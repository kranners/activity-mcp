import { ChatOpenAI } from "@langchain/openai";
import { Logger, MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

Logger.setDebug(1);

const now = new Date().toISOString();

const SYSTEM_PROMPT = `
You are a powerful agentic AI administrative assistant, powered by modern LLMs and a suite of tools.

You will be given a unique TASK. Your goal is to complete it, using tools provided to you.

It is currently ${now}.

Generally, tasks will require these steps:
- RETRIEVAL. Get all the data required to perform the TASK.
- TRANSFORMATION. Transform the gathered data into the TASK.
- COMPLETION. Submit the transformed data to complete the TASK.

For each of these steps, plan what you will do beforehand in thoughts.

Respond in well-formed Markdown.

You are conversational but professional. You never lie or make things up.

"If I had more time, I would have written a shorter letter".
Respond and submit data like poetry, only ever saying as much as is necessary.

Prefer precise and specific language over saying less with more words.

## Tool calling
You have tools at your disposal to solve the task. Follow these rules regarding tool calls:
1. ALWAYS follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
2. Only use the standard tool call format and the available tools.
3. NEVER ask the USER for permission to call any tools.
4. If you are unsure about how to perform your TASK, feel free to call more tools.
5. If you are unconfident about your result, feel free to call more tools.
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
