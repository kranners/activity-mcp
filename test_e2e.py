import pytest
import pytest_asyncio
import logging
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from mcp_use import MCPAgent, MCPClient

load_dotenv()


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

    # llm = ChatOllama(
    #     model="qwen3:4b",
    #     temperature=0.8,
    # )

    llm = ChatOpenAI()
    logging.info("Loaded LLM")

    agent = MCPAgent(llm=llm, client=client, max_steps=30)
    logging.info("Loaded agent, starting!")

    yield agent
    await agent.close()


@pytest_asyncio.fixture(scope="function", autouse=True)
def reset_agent(agent):
    agent.clear_conversation_history()
    logging.info("Cleared conversation history.")

    return agent


def format_prompt_result(prompt, result):
    formatted = (
        f"\n\033[1m\033[93mPrompt:\033[0m {prompt.strip()}\n"
        f"\033[1m\033[96mResult:\033[0m {result.strip()}\n"
        f"{'-' * 60}"
    )

    logging.info(formatted)


EASY_PROMPTS = [
    "Tell me my ClickUp user ID and username.",
    "Tell me my username on GitHub.",
    "Tell me a random one of my git repositories.",
    "Tell me my user ID on Harvest.",
    "Tell me someone's email from my Google directory.",
    "Tell me a color from my Google calendar.",
    "Tell me the current time as an ISO timestamp.",
    "Tell me my name and user ID on Slack.",
]


@pytest.mark.parametrize("prompt", EASY_PROMPTS)
@pytest.mark.asyncio(loop_scope="session")
async def test_easy_prompts(agent, prompt):
    result = await agent.run(f"""
        I am a Tool Tester. I only say correct information from running tools.
        If the required tools don't work for whatever reason, I will say the failure state
        and the word "FAILED".

        My task: {prompt}
    """)

    format_prompt_result(prompt, result)

    assert "FAILED" not in result
