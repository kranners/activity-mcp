# activity-mcp 👨‍🏭

Suite of tools for interacting with a number of services, like Slack, Harvest,
GitHub, etc.

**Fully automate:**

- Timesheets
- Retro notes
- Project tickets
- Async standups
- General admin tasks, checking emails, responding to events
- Deep analysis, summarization and search of any service

Built to eliminate purely transformational tasks, recollection work, and
administrative overhead.

## Why does this exist?

AI was always supposed to save us from tedium. That was the promise.

To bring us to a gilded age where people would only do work that interested them.

Art, programming, music, creative writing, problem solving.

What we see instead is commercial AI taking the human's creative space, leaving
us humans to toil solely in project management tools, meetings, and emails.

**MCP** fits nicely into this by connecting AI agents, who can contain any
context, to external services. But not just input, MCP allows AI agents to
read from external services.

However, the best MCP tooling is unwieldy and difficult to use for anyone who
is not a developer.

This means that all-in-one tools like Copilot, Perplexity (somewhat), and
friends end up topping charts.

Despite not being as personalised or as powerful as other tools, they are
simple to use and setup.

It should be possible for non-technical, non-poweruser individuals to see the
benefits that personalised MCP tools can bring to their workflow and sanity.

In fact, it should be easy.

That is the point of this project.

## Project Structure

```
activity-mcp/
└── packages/
    ├── mcp-server/          # Core MCP server with service integrations
    ├── desktop-app/         # Electron wrapper application
    ├── client-workflows/    # Semi-automated workflow scripts
    └── auth-middleware/     # OAuth authentication middleware
```

## Installation

Use a version manager like `fnm`, `nvm`, Nix, etc to install the `.node-version`:
```bash
fnm use
```

Enable `pnpm` with corepack and install the dependencies:
```bash
corepack enable

pnpm install
```

### Environment variables

Tools throw errors if required environment variables are missing.

**Required:**
- `OPENAI_API_KEY` - OpenAI API key for AI functionality

**Service Integrations:**
- `SLACK_USER_TOKEN` - User token with search scopes (requires Slack app)
- `SLACK_BOT_TOKEN` - Bot token for posting messages
- `SLACK_CLIENT_ID` - OAuth client ID from Slack app
- `SLACK_CLIENT_SECRET` - OAuth client secret from Slack app  
- `SLACK_STATE_SECRET` - Any random string for OAuth state validation
- `CLICKUP_TOKEN` - ClickUp API token
- `CLICKUP_TEAM_ID` - ClickUp team ID from any URL
- `HARVEST_ACCESS_TOKEN` - Harvest API token
- `HARVEST_ACCOUNT_ID` - Harvest account ID
- `GITHUB_TOKEN` - GitHub personal access token

**File Paths:**
- `GIT_REPOSITORIES_ROOT_DIRECTORY` - Root folder containing Git repos
- `TIME_ENTRIES_SQL_PATH` - Path to Timing.app SQLite database
- `GOOGLE_TOKEN_PATH` - Path to Google OAuth token.json
- `GOOGLE_CREDENTIALS_PATH` - Path to Google OAuth credentials.json

#### Google Calendar Setup
1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Calendar API
3. Create OAuth 2.0 Desktop credentials
4. Download `credentials.json` to project root
5. Run app once to generate `token.json`

#### Slack App Setup  
1. Create app at [api.slack.com/apps](https://api.slack.com/apps)
2. Add OAuth scopes: `chat:write`, `channels:read`, `app_mentions:read`
3. Install to workspace to get tokens
4. Copy Client ID and Secret from Basic Information

## Running locally

As of now, there isn't a unified way to run the whole stack at once.

Each package requires independant setup and has a unique way to run.

`desktop-app` is the simplest to run.
