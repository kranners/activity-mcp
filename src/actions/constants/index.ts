import { ChatOpenAI } from "@langchain/openai";
import { Logger, MCPAgent, MCPClient } from "mcp-use";
import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";

Logger.setDebug(1);

const year = new Date().getFullYear();

const personalPrompt = readFileSync(join(__dirname, "personal-prompt.txt"));

const SYSTEM_PROMPT = `
You are a powerful agentic AI administrative assistant, powered by modern LLMs and a suite of tools.

You will be given a unique TASK. Your goal is to complete it, using tools provided to you.

<tone>
1. Be conversational but professional.
2. ALWAYS format your response to match your TASK.
3. NEVER lie or make things up.
4. ALWAYS respond as the SOLUTION and not "Here's your solution ... : <SOLUTION> ..."
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

<user>
${personalPrompt}
</user>
`;

export const MCP_CLIENT_CONFIG = {
  mcpServers: {
    activity: {
      command: "node",
      args: ["--no-deprecation", "./dist/index.js"],
    },
  },
};

export const client = MCPClient.fromDict(MCP_CLIENT_CONFIG);
export const llm = new ChatOpenAI({ model: "gpt-4.1" });

export const agent = new MCPAgent({
  llm,
  client,
  maxSteps: 30,
  verbose: true,
  systemPrompt: SYSTEM_PROMPT,
});

export const run = async (prompt: string) => {
  agent.clearConversationHistory();
  return agent.run(prompt);
};
