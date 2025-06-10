import pytest
import pytest_asyncio
import logging
from dotenv import load_dotenv
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
    llm = ChatOpenAI(model="gpt-4o")
    agent = MCPAgent(llm=llm, client=client, max_steps=30)

    yield agent
    await agent.close()


def format_prompt_result(prompt, result):
    formatted = (
        f"\n\033[1m\033[93mPrompt:\033[0m {prompt.strip()}\n"
        f"\033[1m\033[96mResult:\033[0m {result.strip()}\n"
        f"{'-' * 60}"
    )

    logging.info(formatted)


@pytest.mark.asyncio(loop_scope="session")
async def test_current_time_is_iso_timestamp(agent):
    prompt = "Tell me the current time as an ISO timestamp."
    result = await agent.run(prompt)

    format_prompt_result(prompt, result)

    assert "unable" not in result


@pytest.mark.asyncio(loop_scope="session")
async def test_slack_messages(agent):
    prompt = "What is my name and user ID on Slack?"
    result = await agent.run(prompt)

    format_prompt_result(prompt, result)

    assert "unable" not in result


@pytest.mark.asyncio(loop_scope="session")
async def test_clickup_user(agent):
    prompt = "What is my ClickUp user ID?"
    result = await agent.run(prompt)

    format_prompt_result(prompt, result)

    assert "unable" not in result


@pytest.mark.asyncio(loop_scope="session")
async def test_google_calendar(agent):
    prompt = "What is the Google event color ID closest to purple?"
    result = await agent.run(prompt)

    format_prompt_result(prompt, result)

    assert "unable" not in result
