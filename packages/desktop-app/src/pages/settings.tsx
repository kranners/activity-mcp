import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Cloud,
  Code,
  Database,
  Key,
  MessageCircle,
  Shield,
  Sun,
} from "lucide-react";
import React from "react";

function SettingsPage() {
  const [darkMode, setDarkMode] = React.useState(false);

  // Environment variables state
  const [envVars, setEnvVars] = React.useState({
    GITHUB_TOKEN: "",
    SLACK_USER_TOKEN: "",
    SLACK_BOT_TOKEN: "",
    CLICKUP_TOKEN: "",
    TIME_ENTRIES_SQL_PATH: "",
    CLICKUP_TEAM_ID: "",
    HARVEST_ACCESS_TOKEN: "",
    HARVEST_ACCOUNT_ID: "",
    GIT_REPOSITORIES_ROOT_DIRECTORY: "",
    GOOGLE_CREDENTIALS_PATH: "",
    GOOGLE_TOKEN_PATH: "",
    OPENAI_API_KEY: "",
    OLLAMA_HOST: "",
    DEBUG: false,
  });

  const handleEnvVarChange = (key: string, value: string | boolean) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 w-full">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your chatbot preferences and account settings.
            </p>
          </div>

          <Separator />

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sun className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your chatbot client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chat Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Chat Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure your chat experience and AI behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Input id="ai-model" value="GPT-4" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="You are a helpful AI assistant..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto-save Conversations</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save chat history
                  </p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* API Keys & Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>API Keys & Tokens</span>
              </CardTitle>
              <CardDescription>
                Configure your API keys and authentication tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github-token">GitHub Token</Label>
                  <Input
                    id="github-token"
                    type="password"
                    placeholder="ghp_..."
                    value={envVars.GITHUB_TOKEN}
                    onChange={(e) =>
                      handleEnvVarChange("GITHUB_TOKEN", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                  <Input
                    id="openai-api-key"
                    type="password"
                    placeholder="sk-..."
                    value={envVars.OPENAI_API_KEY}
                    onChange={(e) =>
                      handleEnvVarChange("OPENAI_API_KEY", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-user-token">Slack User Token</Label>
                  <Input
                    id="slack-user-token"
                    type="password"
                    placeholder="xoxp-..."
                    value={envVars.SLACK_USER_TOKEN}
                    onChange={(e) =>
                      handleEnvVarChange("SLACK_USER_TOKEN", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slack-bot-token">Slack Bot Token</Label>
                  <Input
                    id="slack-bot-token"
                    type="password"
                    placeholder="xoxb-..."
                    value={envVars.SLACK_BOT_TOKEN}
                    onChange={(e) =>
                      handleEnvVarChange("SLACK_BOT_TOKEN", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clickup-token">ClickUp Token</Label>
                  <Input
                    id="clickup-token"
                    type="password"
                    placeholder="pk_..."
                    value={envVars.CLICKUP_TOKEN}
                    onChange={(e) =>
                      handleEnvVarChange("CLICKUP_TOKEN", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvest-access-token">
                    Harvest Access Token
                  </Label>
                  <Input
                    id="harvest-access-token"
                    type="password"
                    value={envVars.HARVEST_ACCESS_TOKEN}
                    onChange={(e) =>
                      handleEnvVarChange("HARVEST_ACCESS_TOKEN", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="h-5 w-5" />
                <span>Service Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure service-specific settings and IDs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clickup-team-id">ClickUp Team ID</Label>
                  <Input
                    id="clickup-team-id"
                    placeholder="Team ID"
                    value={envVars.CLICKUP_TEAM_ID}
                    onChange={(e) =>
                      handleEnvVarChange("CLICKUP_TEAM_ID", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvest-account-id">Harvest Account ID</Label>
                  <Input
                    id="harvest-account-id"
                    placeholder="Account ID"
                    value={envVars.HARVEST_ACCOUNT_ID}
                    onChange={(e) =>
                      handleEnvVarChange("HARVEST_ACCOUNT_ID", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ollama-host">Ollama Host</Label>
                  <Input
                    id="ollama-host"
                    placeholder="http://localhost:11434"
                    value={envVars.OLLAMA_HOST}
                    onChange={(e) =>
                      handleEnvVarChange("OLLAMA_HOST", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>File Paths</span>
              </CardTitle>
              <CardDescription>
                Configure file and directory paths for various services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time-entries-sql-path">
                  Time Entries SQL Path
                </Label>
                <Input
                  id="time-entries-sql-path"
                  placeholder="/path/to/time_entries.sql"
                  value={envVars.TIME_ENTRIES_SQL_PATH}
                  onChange={(e) =>
                    handleEnvVarChange("TIME_ENTRIES_SQL_PATH", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="git-repositories-root">
                  Git Repositories Root Directory
                </Label>
                <Input
                  id="git-repositories-root"
                  placeholder="/path/to/repositories"
                  value={envVars.GIT_REPOSITORIES_ROOT_DIRECTORY}
                  onChange={(e) =>
                    handleEnvVarChange(
                      "GIT_REPOSITORIES_ROOT_DIRECTORY",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-credentials-path">
                  Google Credentials Path
                </Label>
                <Input
                  id="google-credentials-path"
                  placeholder="/path/to/credentials.json"
                  value={envVars.GOOGLE_CREDENTIALS_PATH}
                  onChange={(e) =>
                    handleEnvVarChange(
                      "GOOGLE_CREDENTIALS_PATH",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-token-path">Google Token Path</Label>
                <Input
                  id="google-token-path"
                  placeholder="/path/to/token.json"
                  value={envVars.GOOGLE_TOKEN_PATH}
                  onChange={(e) =>
                    handleEnvVarChange("GOOGLE_TOKEN_PATH", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Debug Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Debug Settings</span>
              </CardTitle>
              <CardDescription>
                Configure debugging and development options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging and debug information
                  </p>
                </div>
                <Switch
                  id="debug-mode"
                  checked={envVars.DEBUG}
                  onCheckedChange={(checked) =>
                    handleEnvVarChange("DEBUG", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-notifications">
                    Sound Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when receiving messages
                  </p>
                </div>
                <Switch id="sound-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="desktop-notifications">
                    Desktop Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications for new messages
                  </p>
                </div>
                <Switch id="desktop-notifications" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your data and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection">Allow Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the AI by sharing anonymous usage data
                  </p>
                </div>
                <Switch id="data-collection" />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  Export Chat History
                </Button>
                <Button variant="destructive" className="w-full">
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
