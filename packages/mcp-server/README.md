# mcp-server 🕰️

MCP server for interacting with a number of services, like Slack, Harvest, GitHub, etc.

This is primarily for automating timesheets, however these tools can be used for whatever you'd like!

Possible use-cases include:
- Slack server analysis (which channels are used most/least often, etc).
- Desktop activity summarization, which programs you used when and for how long.
- Searching and responding to Google Calendar invites.
- Summarizing GitHub review and PR contributions.

## Installation

> [!WARNING]
> This won't work anymore, as activity-mcp is no longer a standalone package.
> Updated installation instructions will be coming once ready.

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

