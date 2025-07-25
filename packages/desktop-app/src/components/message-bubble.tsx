import React from "react";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Message } from "@/hooks/use-messages";
import remarkGfm from "remark-gfm";

import { ToolCallMessage } from "@/components/tool-call-message";
import { StreamingText } from "@/components/streaming-text";

const MessageBubble = ({
  message,
  onStreamComplete,
}: {
  message: Message;
  onStreamComplete?: () => void;
}) => {
  const isUser = message.type === "user";
  const isThought = message.type === "assistant-thought";
  const isToolCall = message.type === "tool-call";

  if (isToolCall && message.toolCall) {
    return (
      <ToolCallMessage
        toolCall={message.toolCall}
        onComplete={onStreamComplete}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-3 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isThought ? "bg-gray-200" : "bg-blue-100"
          }`}
        >
          <Bot
            className={`h-4 w-4 ${isThought ? "text-gray-500" : "text-blue-600"}`}
          />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <Card
          className={`p-4 ${
            isUser
              ? "bg-blue-600 text-white"
              : isThought
                ? "bg-gray-100 border-gray-200"
                : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          {isThought ? (
            <div className="text-gray-600 text-sm italic">
              <span className="text-xs uppercase tracking-wide font-medium text-gray-400 block mb-2">
                Thinking...
              </span>
              <StreamingText
                content={message.content}
                isStreaming={message.isStreaming}
                streamedContent={message.streamedContent}
              />
            </div>
          ) : isUser ? (
            <p className="text-white">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.isStreaming
                  ? message.streamedContent || ""
                  : message.content}
              </ReactMarkdown>
            </div>
          )}
        </Card>
        <div
          className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

export { MessageBubble };
