import dayjs, { Dayjs } from "dayjs";
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

  useEffect(() => {
    window.electronAPI.onReceiveBotMessage((content: string) => {
      const message: Message = {
        id: messages.length,
        role: "bot",
        content,
        timestamp: dayjs(),
      };

      appendMessage(message);
    });
  });

  return (
    <MessageContext.Provider value={{ messages, sendUserMessage }} {...props}>
      {children}
    </MessageContext.Provider>
  );
}
