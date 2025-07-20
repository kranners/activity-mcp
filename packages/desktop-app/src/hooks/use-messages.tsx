import { StreamEvent } from "mcp-use";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  Clock,
  MessageSquare,
  CheckSquare,
  Monitor,
  Timer,
  GitBranch,
  Zap,
} from "lucide-react";

import {
  SiSlack,
  SiClickup,
  SiGithub,
  SiGoogle,
  SiGooglecalendar,
} from "@icons-pack/react-simple-icons";

export const TOOL_TO_SPLASH = {
  getDateTime: {
    description: "Getting date & time",
    icon: Clock,
  },
  getSlackUser: {
    description: "Getting Slack user info",
    icon: SiSlack,
  },
  getSlackMessages: {
    description: "Fetching Slack messages",
    icon: MessageSquare,
  },
  getClickUpUser: {
    description: "Getting ClickUp user info",
    icon: SiClickup,
  },
  getClickUpTasks: {
    description: "Fetching ClickUp tasks",
    icon: CheckSquare,
  },
  getDesktopActivitiesForTimeRange: {
    description: "Getting desktop activities",
    icon: Monitor,
  },
  getHarvestUser: {
    description: "Getting Harvest user info",
    icon: Timer,
  },
  getHarvestProjectAssignments: {
    description: "Getting Harvest projects",
    icon: Timer,
  },
  createTimeEntry: {
    description: "Creating time entry",
    icon: Timer,
  },
  getLocalGitRepositories: {
    description: "Getting local Git repos",
    icon: GitBranch,
  },
  getAllRepositoriesReflogs: {
    description: "Getting Git reflogs",
    icon: GitBranch,
  },
  getGitHubUser: {
    description: "Getting GitHub user info",
    icon: SiGithub,
  },
  getGitHubUserContributions: {
    description: "Getting GitHub contributions",
    icon: SiGithub,
  },
  getGoogleCalendarEvents: {
    description: "Getting calendar events",
    icon: SiGooglecalendar,
  },
  respondToGoogleCalendarEvent: {
    description: "Responding to calendar event",
    icon: SiGooglecalendar,
  },
  getGoogleUser: {
    description: "Getting Google user info",
    icon: SiGoogle,
  },
  getGoogleDirectoryPeople: {
    description: "Getting directory people",
    icon: SiGoogle,
  },
  createGoogleCalendarEvent: {
    description: "Creating calendar event",
    icon: SiGooglecalendar,
  },
  getGoogleCalendarColors: {
    description: "Getting calendar colors",
    icon: SiGooglecalendar,
  },
} as const;

const isDisplayableTool = (
  name: string,
): name is keyof typeof TOOL_TO_SPLASH => {
  return name in TOOL_TO_SPLASH;
};

const getToolDisplay = (name: string) => {
  if (isDisplayableTool(name)) {
    return TOOL_TO_SPLASH[name];
  }

  return {
    description: name,
    icon: Zap,
  };
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: "pending" | "completed";
};

export type Message = {
  id: string;
  type: "user" | "assistant-thought" | "assistant-result" | "tool-call";
  content: string;
  toolCall?: ToolCall;
  timestamp: Date;
  isStreaming?: boolean;
  streamedContent?: string;
};

type MessageContextProps = {
  messages: Message[];
  sendUserMessage: (content: string) => void;

  isTyping: boolean;
};

const MessageContext = createContext<MessageContextProps | null>(null);

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider.");
  }

  return context;
}

export function MessageProvider({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessages, setStreamingMessages] = useState<
    Map<string, Message>
  >(new Map());

  const sendUserMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    window.electronAPI.sendUserMessage(content);
  };

  const handleBotEvent = (event: StreamEvent) => {
    console.log("handling event", JSON.stringify(event));

    if (event.event === "on_chain_start") {
      // Agent starts executing - show thinking state
      setIsTyping(true);
    }

    if (event.event === "on_chain_end") {
      // Agent starts executing - show thinking state
      setIsTyping(false);
    }

    if (event.event === "on_tool_start") {
      // Tool starts executing
      const toolStartId = `tool-${Date.now()}-${event.name}`;
      const { icon, description } = getToolDisplay(event.name);

      const pendingToolCall: Message = {
        id: toolStartId,
        type: "tool-call",
        content: "",
        toolCall: {
          id: toolStartId,
          name: event.name,
          arguments: event.data.input || {},
          icon,
          description,
          status: "pending",
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, pendingToolCall]);
    }

    if (event.event === "on_tool_end") {
      // Tool finishes executing
      setMessages((prev) =>
        prev.map((msg) =>
          msg.toolCall &&
          msg.toolCall.name === event.name &&
          msg.toolCall.status === "pending"
            ? {
                ...msg,
                toolCall: {
                  ...msg.toolCall,
                  status: "completed" as const,
                  result: event.data.output,
                },
              }
            : msg,
        ),
      );
    }

    if (event.event === "on_chat_model_stream") {
      // Handle streaming chunks
      if (event.data.chunk) {
        const { id: chunkId, content: chunkContent } = event.data.chunk;

        setStreamingMessages((prev) => {
          const existing = prev.get(chunkId);
          if (existing) {
            // Append to existing message
            const updatedContent =
              (existing.streamedContent || "") + chunkContent;
            const updatedMessage = {
              ...existing,
              streamedContent: updatedContent,
              isStreaming: true,
            };
            return new Map(prev.set(chunkId, updatedMessage));
          } else {
            // Create new streaming message
            const newMessage: Message = {
              id: chunkId,
              type: "assistant-result" as const,
              content: "",
              timestamp: new Date(),
              isStreaming: true,
              streamedContent: chunkContent,
            };
            return new Map(prev.set(chunkId, newMessage));
          }
        });

        // Update the main messages array
        setMessages((prev) => {
          const existingIndex = prev.findIndex((msg) => msg.id === chunkId);
          const streamingMessage = streamingMessages.get(chunkId);

          if (existingIndex >= 0 && streamingMessage) {
            // Update existing message
            const updated = [...prev];
            updated[existingIndex] = {
              ...streamingMessage,
              streamedContent:
                (streamingMessage.streamedContent || "") + chunkContent,
            };
            return updated;
          } else {
            // Add new streaming message
            const newMessage: Message = {
              id: chunkId,
              type: "assistant-result",
              content: "",
              timestamp: new Date(),
              isStreaming: true,
              streamedContent: chunkContent,
            };
            return [...prev, newMessage];
          }
        });
      }
    }
  };

  useEffect(() => {
    window.electronAPI.onReceiveBotEvent(handleBotEvent);
  });

  return (
    <MessageContext.Provider
      value={{ messages, sendUserMessage, isTyping }}
      {...props}
    >
      {children}
    </MessageContext.Provider>
  );
}
