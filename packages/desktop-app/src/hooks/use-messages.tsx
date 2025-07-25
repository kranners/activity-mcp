import { StreamEvent } from "mcp-use";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { z, ZodError } from "zod";

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
    icon: SiSlack,
  },
  getClickUpUser: {
    description: "Getting ClickUp user info",
    icon: SiClickup,
  },
  getClickUpTasks: {
    description: "Fetching ClickUp tasks",
    icon: SiClickup,
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

const events: Record<string, number> = {};

export function MessageProvider({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

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
    const eventTypeCount = events[event.event] ?? 0;
    events[event.event] = eventTypeCount + 1;

    if (event.event === "on_chain_start") {
      setIsTyping(true);
    }

    if (event.event === "on_chain_end") {
      setIsTyping(false);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.isStreaming) {
            return {
              ...msg,
              content: msg.streamedContent || msg.content,
              isStreaming: false,
            };
          }

          return msg;
        }),
      );
    }

    if (event.event === "on_tool_start") {
      const toolId = `tool-${Date.now()}-${event.name}`;
      const { icon, description } = getToolDisplay(event.name);

      const toolCallMessage: Message = {
        id: toolId,
        type: "tool-call",
        content: "",
        toolCall: {
          id: toolId,
          name: event.name,
          arguments: event.data.input.input || {},
          icon,
          description,
          status: "pending",
        },
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, toolCallMessage]);
    }

    // Handle tool end events
    if (event.event === "on_tool_end") {
      setMessages((prev) => {
        const pending = prev.find((message) => {
          return (
            message.toolCall &&
            message.toolCall.name === event.name &&
            message.toolCall.status === "pending"
          );
        });

        if (pending === undefined) {
          throw new Error(
            "An on_tool_end event was received with no equivalent on_tool_start!",
          );
        }

        if (pending.toolCall?.id === undefined) {
          throw new Error("An on_tool_start event didn't have an ID!");
        }

        const updatedToolCall: Message = {
          ...pending,
          toolCall: {
            ...pending.toolCall,
            status: "completed" as const,
            result: event.data.output,
          },
        };

        return [...prev.slice(0, -1), updatedToolCall];
      });
    }

    // Handle streaming events
    if (event.event === "on_chat_model_stream" && event.data.chunk) {
      const { id: chunkId, content: chunkContent } = event.data.chunk;

      // Skip empty content chunks
      if (!chunkContent) {
        return;
      }

      setMessages((prev) => {
        const existing = prev.find((message) => message.id === chunkId);

        if (existing) {
          const currentContent = existing.streamedContent || "";

          const updated: Message = {
            ...existing,
            streamedContent: currentContent + chunkContent,
            isStreaming: true,
          };

          return [...prev.slice(0, -1), updated];
        }

        const newStreamingMessage: Message = {
          id: chunkId,
          type: "assistant-result",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
          streamedContent: chunkContent,
        };

        return [...prev, newStreamingMessage];
      });
    }
  };

  useEffect(() => {
    window.electronAPI.onReceiveBotEvent(handleBotEvent);

    return () => {
      window.electronAPI.removeAllListeners("sendBotEvent");
    };
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
