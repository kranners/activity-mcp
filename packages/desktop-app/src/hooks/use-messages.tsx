import dayjs, { Dayjs } from "dayjs";
import { StreamEvent } from "mcp-use";
import React, { createContext, useContext, useEffect, useState } from "react";

type Message = {
  id: number;
  role: "bot" | "user";
  content: string;
  timestamp: Dayjs;
};

type MessageContextProps = {
  messages: Message[];
  sendUserMessage: (content: string) => void;
};

const MessageContext = createContext<MessageContextProps | null>(null);

export function useMessage() {
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

  const appendMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  const sendUserMessage = (content: string) => {
    const message: Message = {
      id: messages.length,
      role: "user",
      content,
      timestamp: dayjs(),
    };

    appendMessage(message);

    window.electronAPI.sendUserMessage(content);
  };

  const handleBotEvent = (event: StreamEvent) => {
    const { input, output, chunk } = event.data;

    function getGenericEventContent() {
      return `### ${event.event}\n\n${JSON.stringify({ output, chunk }, null, 2)}`;
    }

    function getToolCallEventContent() {
      return `### tool call ${event.name}\n\n${JSON.stringify({ input, output }, null, 2)}`;
    }

    const eventIsAToolCall =
      event.event === "on_tool_start" || event.event === "on_tool_end";

    const content = eventIsAToolCall
      ? getToolCallEventContent()
      : getGenericEventContent();

    const message: Message = {
      id: messages.length,
      role: "bot",
      content,
      timestamp: dayjs(),
    };

    appendMessage(message);
  };

  useEffect(() => {
    window.electronAPI.onReceiveBotEvent(handleBotEvent);
  });

  return (
    <MessageContext.Provider value={{ messages, sendUserMessage }} {...props}>
      {children}
    </MessageContext.Provider>
  );
}
