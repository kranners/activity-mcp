import React, { useMemo } from "react";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Message } from "@/hooks/use-messages";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

import { ToolCallMessage } from "@/components/tool-call-message";
import { StreamingText } from "@/components/streaming-text";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MessageBubbleContent = ({ message }: { message: Message }) => {
  const { type, content, isStreaming, streamedContent } = message;

  const messageContent = useMemo(() => {
    if (isStreaming) {
      return streamedContent ?? "";
    }

    return content;
  }, [isStreaming, streamedContent, content]);

  if (type === "assistant-thought") {
    return (
      <div className="text-gray-600 text-sm italic">
        <span className="text-xs uppercase tracking-wide font-medium text-gray-400 block mb-2">
          Thinking...
        </span>
        <StreamingText
          content={content}
          isStreaming={isStreaming}
          streamedContent={streamedContent}
        />
      </div>
    );
  }

  if (type === "user") {
    return <p className="text-white">{content}</p>;
  }

  return (
    <div className="prose prose-sm max-w-none markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: Table,
          tbody: TableBody,
          thead: TableHeader,
          caption: TableCaption,
          td: TableCell,
          th: TableHead,
          tr: TableRow,
        }}
      >
        {messageContent}
      </ReactMarkdown>
    </div>
  );
};

const MessageBubble = ({
  message,
  onStreamComplete,
}: {
  message: Message;
  onStreamComplete?: () => void;
}) => {
  const { type, toolCall } = message;

  const isUser = type === "user";
  const isThought = type === "assistant-thought";

  if (type === "tool-call" && toolCall) {
    return (
      <ToolCallMessage toolCall={toolCall} onComplete={onStreamComplete} />
    );
  }

  const cardStyleClassname = useMemo(() => {
    if (isUser) {
      return "bg-blue-600 text-white";
    }

    if (isThought) {
      return "bg-gray-100 border-gray-200";
    }

    return "bg-white border-gray-200 shadow-sm";
  }, [isUser, isThought]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            isThought ? "bg-gray-200" : "bg-blue-100",
          )}
        >
          <Bot
            className={cn(
              "h-4 w-4",
              isThought ? "text-gray-500" : "text-blue-600",
            )}
          />
        </div>
      )}

      <div className={cn("max-w-[80%]", isUser && "order-first")}>
        <Card className={cn("p-4", cardStyleClassname)}>
          <MessageBubbleContent message={message} />
        </Card>
        <div
          className={cn(
            "text-xs text-gray-400 mt-1",
            isUser ? "text-right" : "text-left",
          )}
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
