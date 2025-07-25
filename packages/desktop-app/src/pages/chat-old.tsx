import React, { useState } from "react";
import { Send, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMessages } from "@/hooks/use-messages";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

function ChatPage() {
  const [message, setMessage] = useState<string>("");
  const { messages, sendUserMessage } = useMessages();

  const handleSendMessage = () => {
    if (message.trim()) {
      sendUserMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" && "justify-end",
                msg.role === "bot" && "justify-start",
              )}
            >
              <div
                className={cn([
                  "flex space-x-3",
                  msg.role === "user" &&
                    "flex-row-reverse space-x-reverse max-w-[70%]",
                  msg.role === "bot" && "max-w-full",
                ])}
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
                  className={cn(
                    "rounded-lg p-3",
                    msg.role === "user" && "bg-primary text-primary-foreground",
                    msg.role === "bot" && "bg-muted",
                  )}
                >
                  <div className="text-sm markdown-content">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </Markdown>
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      msg.role === "user" && "text-primary-foreground/70",
                      msg.role === "bot" && "text-muted-foreground",
                    )}
                  >
                    {msg.timestamp.format("h:mm a")}
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
            placeholder="What can you do?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none"
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
}

export default ChatPage;
