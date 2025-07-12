import { ElectronAPI } from "@/electron/preload";
import * as React from "react";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

import {
  MessageCircle,
  Settings,
  Send,
  Bot,
  User,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  Sun,
  Bell,
  Shield,
  HelpCircle,
  ChevronDown,
  Key,
  Database,
  Code,
  Cloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Mock data for chat conversations
const conversations = [
  {
    id: 1,
    title: "General Chat",
    lastMessage: "How can I help you today?",
    timestamp: "2 min ago",
  },
  {
    id: 2,
    title: "Code Review",
    lastMessage: "The function looks good overall...",
    timestamp: "1 hour ago",
  },
  {
    id: 3,
    title: "Project Planning",
    lastMessage: "Let me break down the timeline...",
    timestamp: "3 hours ago",
  },
  {
    id: 4,
    title: "Bug Fixes",
    lastMessage: "I found the issue in the component...",
    timestamp: "5 hours ago",
  },
  {
    id: 5,
    title: "API Integration",
    lastMessage: "The endpoint is working correctly...",
    timestamp: "1 day ago",
  },
];

// Mock chat messages
const chatMessages = [
  {
    id: 1,
    role: "user",
    content: "Hello! Can you help me with a React component?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    role: "bot",
    content:
      "Of course! I'd be happy to help you with React components. What specific aspect would you like assistance with?",
    timestamp: "10:30 AM",
  },
  {
    id: 3,
    role: "user",
    content: "I need to create a form with validation",
    timestamp: "10:32 AM",
  },
  {
    id: 4,
    role: "bot",
    content:
      "Great! For form validation in React, I recommend using libraries like React Hook Form with Zod for schema validation. Would you like me to show you an example?",
    timestamp: "10:32 AM",
  },
  {
    id: 5,
    role: "user",
    content: "Yes, that would be helpful!",
    timestamp: "10:33 AM",
  },
  {
    id: 6,
    role: "bot",
    content:
      "Here's a basic example of a form with validation using React Hook Form and Zod. This approach provides type safety and excellent developer experience.",
    timestamp: "10:33 AM",
  },
  {
    id: 7,
    role: "user",
    content: "This looks great! How do I handle async validation?",
    timestamp: "10:35 AM",
  },
  {
    id: 8,
    role: "bot",
    content:
      "For async validation, you can use the resolver pattern with async functions. Here's how you can implement server-side validation checks.",
    timestamp: "10:35 AM",
  },
  {
    id: 9,
    role: "user",
    content: "Can you show me an example with error handling?",
    timestamp: "10:37 AM",
  },
  {
    id: 10,
    role: "bot",
    content:
      "Here's how you can implement comprehensive error handling in your forms with proper user feedback.",
    timestamp: "10:37 AM",
  },
];

function ChatbotClientContent() {
  const [activeTab, setActiveTab] = React.useState("chat");
  const [selectedConversation, setSelectedConversation] = React.useState(
    conversations[0],
  );
  const [message, setMessage] = React.useState("");
  const [darkMode, setDarkMode] = React.useState(false);
  const [chatExpanded, setChatExpanded] = React.useState(true);

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

  // Now we can use the useSidebar hook since we're inside the SidebarProvider
  const { toggleSidebar } = useSidebar();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message logic here
      setMessage("");
    }
  };

  const handleEnvVarChange = (key: string, value: string | boolean) => {
    setEnvVars((prev) => ({ ...prev, [key]: value }));
  };

  const ChatPage = () => (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{selectedConversation.title}</h3>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex space-x-3 max-w-[70%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="border-r">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold">ChatBot Client</h2>
              <p className="text-xs text-muted-foreground">Desktop v1.0</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  defaultOpen={chatExpanded}
                  onOpenChange={setChatExpanded}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={activeTab === "chat"}
                        onClick={() => setActiveTab("chat")}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <div className="flex items-center justify-between px-2 py-1">
                          <span className="text-xs text-muted-foreground">
                            Conversations
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {conversations.map((conversation) => (
                          <SidebarMenuSubItem key={conversation.id}>
                            <SidebarMenuSubButton
                              isActive={
                                selectedConversation.id === conversation.id
                              }
                              onClick={() =>
                                setSelectedConversation(conversation)
                              }
                              className="group"
                            >
                              <div className="flex flex-col items-start w-full">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium text-sm truncate">
                                    {conversation.title}
                                  </span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Rename
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <p className="text-xs text-muted-foreground truncate w-full text-left">
                                  {conversation.lastMessage}
                                </p>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Separator className="my-2" />

          {/* Toggle Controls */}
          <div className="px-2 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Toggle:</span>
                <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>S
                </kbd>
              </div>
              <SidebarTrigger className="h-6 w-6" />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1">
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === "chat" && <ChatPage />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </SidebarInset>
    </div>
  );
}

export default function DesktopChatbotClient() {
  return (
    <SidebarProvider>
      <ChatbotClientContent />
    </SidebarProvider>
  );
}
