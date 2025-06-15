import pytest
import pytest_asyncio
import logging
import mcp_use
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from mcp_use import MCPAgent, MCPClient

load_dotenv()
mcp_use.set_debug(1)


@pytest_asyncio.fixture(scope="session")
async def agent():
    client = MCPClient.from_dict(
        {
            "mcpServers": {
                "activity": {
                    "command": "node",
                    "args": ["./dist/index.js"],
                }
            }
        }
    )
    logging.info("Loaded MCP client")

    llm = ChatOllama(
        model="qwen3:4b",
        temperature=0.8,
        verbose=True,
    )

    # llm = ChatOpenAI()
    logging.info("Loaded LLM")

    agent = MCPAgent(
        llm=llm,
        client=client,
        max_steps=30,
        verbose=True,
    )
    logging.info("Loaded agent, starting!")

    yield agent
    await agent.close()


@pytest_asyncio.fixture(scope="function", autouse=True)
def reset_agent(agent):
    agent.clear_conversation_history()
    logging.info("Cleared conversation history.")

    return agent


EASY_PROMPTS = [
    "Tell me my ClickUp user ID and username.",
    "Tell me my username on GitHub.",
    "Tell me a random one of my git repositories.",
    "Tell me my user ID on Harvest.",
    "Tell me my email on Google.",
    "Tell me the current time as an ISO timestamp.",
    "Tell me my name and user ID on Slack.",
]


@pytest.mark.parametrize("prompt", EASY_PROMPTS)
@pytest.mark.asyncio(loop_scope="session")
async def test_easy_prompts(agent, prompt):
    result = await agent.run(prompt)
    logging.info(f"Result: {result}")

    assert "FAILED" not in result
