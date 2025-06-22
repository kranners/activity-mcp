# activity-mcp 🕰️

MCP server for interacting with a number of services, like Slack, Harvest, GitHub, etc.

This is primarily for automating timesheets, however these tools can be used for whatever you'd like!

Possible use-cases include:
- Slack server analysis (which channels are used most/least often, etc).
- Desktop activity summarization, which programs you used when and for how long.
- Searching and responding to Google Calendar invites.
- Summarizing GitHub review and PR contributions.

## Installation

Install to your `mcp.json` in your MCP client of choice (Cursor, Claude Desktop, etc):
```json
{
  "mcpServers": {
    "activity": {
      "command": "npx",
      "args": [
        "activity-mcp@latest"
      ],
    }
  }
}
```

### Environment variables

There are a number of environment variables, generally for authentication which
you can set to get these integrations working.

Tools will throw errors before trying anything if their relevant environment
variables are not set.

- `GIT_REPOSITORIES_ROOT_DIRECTORY` - The root folder containing relevant Git repositories.
Usually `~/git` or `~/workspace`, you'll know what yours is.

- `SLACK_USER_TOKEN` - A Slack user (NOT A BOT!) token with scopes available to search.

- `CLICKUP_TOKEN` - A ClickUp API token.
- `CLICKUP_TEAM_ID` - Your ClickUp team ID. Should be obvious from any ClickUp URL.

- `HARVEST_ACCESS_TOKEN` - A Harvest API token.
- `HARVEST_ACCOUNT_ID` - Your personal account ID in Harvest.

- `GITHUB_TOKEN` - A GitHub personal access token for use with the GraphQL API.

- `TIME_ENTRIES_SQL_PATH` - A path to a SQLite.db containing your time entries.
For usage with Timing.app, this is at `/Users/<your-user>/Library/Application Support/info.eurocomp.Timing2/SQLite.db`

- `GOOGLE_TOKEN_PATH` - A path to a valid token.json for use with the Google Calendar API.
- `GOOGLE_CREDENTIALS_PATH` - A path to a valid credentials.json for use with the Google Calendar API.

