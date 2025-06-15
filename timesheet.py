import asyncio
from pprint import pprint
from dotenv import load_dotenv
import mcp_use
from mcp_use import MCPAgent, MCPClient

# from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

load_dotenv()
mcp_use.set_debug(1)


async def main():
    llm = ChatOpenAI()

    # llm = ChatOllama(model="qwen3:4b", temperature=0.8)

    client = MCPClient.from_dict(
        {
            "mcpServers": {
                "jailbreak": {
                    "command": "npx",
                    "args": [
                        "jailbreak-mcp@latest",
                        "/Users/aaronpierce/.cursor/activity.jailbreak.mcp.json",
                    ],
                }
            }
        }
    )

    agent = MCPAgent(
        llm=llm,
        client=client,
        max_steps=50,
        verbose=True,
    )

    agent.clear_conversation_history()

    response = await agent.run("""
        Could you summarize my desktop activity for 2025-05-26 between 9am and 5pm? 

        Start by changing to the desktop activity mode.
        Then re-list available tools.
        Ensure you get all the data available.

        Break it down in 30 minute chunks like:

        ### 09:00–09:30
        <A description of what was happening at that time.>
        <A line break>
        <A breakdown of which applications were used and for what amount of time>
        <Like:>
        <50% - Arc>
        <10% - another application, etc>
    """)

    pprint(response)


if __name__ == "__main__":
    asyncio.run(main())
