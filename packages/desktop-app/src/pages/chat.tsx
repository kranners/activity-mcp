import React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Message, ToolCall, useMessages } from "@/hooks/use-messages";

const StreamingText = ({
  content,
  isStreaming,
  streamedContent,
  className = "",
}: {
  content: string;
  isStreaming?: boolean;
  streamedContent?: string;
  className?: string;
}) => {
  const displayContent = isStreaming ? streamedContent || "" : content;

  return (
    <span className={className}>
      {displayContent}
      {isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-0.5 h-4 bg-current ml-0.5"
        />
      )}
    </span>
  );
};

const ToolCallMessage = ({
  toolCall,
  onComplete,
}: {
  toolCall: ToolCall;
  onComplete?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const IconComponent = toolCall.icon;
  const isPending = toolCall.status === "pending";

  useEffect(() => {
    if (toolCall.status === "completed" && !hasCompleted) {
      setHasCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [toolCall.status, hasCompleted, onComplete]);

  // Animation configurations
  const pendingCardAnimation = {
    y: [-2, 2, -2],
    boxShadow: [
      "0 8px 25px -5px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05)",
      "0 12px 35px -5px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.1)",
      "0 8px 25px -5px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05)",
    ],
  };

  const completedCardAnimation = {
    y: [2, 0],
    boxShadow: [
      "0 12px 35px -5px rgba(251, 146, 60, 0.25)",
      "0 4px 6px -1px rgba(59, 130, 246, 0.1)",
    ],
  };

  const pendingCardTransition = {
    y: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
    boxShadow: {
      duration: 2.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  };

  const completedCardTransition = {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  const pendingIconAnimation = {
    rotate: 360,
  };

  const completedIconAnimation = {
    scale: [1, 1.2, 1],
    rotate: [0, 5, -5, 0],
  };

  const pendingIconTransition = {
    rotate: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear" as const,
    },
  };

  const completedIconTransition = {
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  const pendingTextAnimation = {
    opacity: [0.8, 1, 0.8],
  };

  const pendingTextTransition = {
    duration: 1.5,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  };

  const cardAnimation = isPending
    ? pendingCardAnimation
    : hasCompleted
      ? completedCardAnimation
      : {};

  const cardTransition = isPending
    ? pendingCardTransition
    : hasCompleted
      ? completedCardTransition
      : {};

  const iconAnimation = isPending
    ? pendingIconAnimation
    : hasCompleted
      ? completedIconAnimation
      : {};

  const iconTransition = isPending
    ? pendingIconTransition
    : hasCompleted
      ? completedIconTransition
      : {};

  const textAnimation = isPending ? pendingTextAnimation : {};
  const textTransition = isPending ? pendingTextTransition : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-4 max-w-2xl mx-auto lg:mx-0"
    >
      <div>
        <motion.div animate={cardAnimation} transition={cardTransition}>
          <Card
            className={`p-4 transition-all duration-700 border-l-4 cursor-pointer ${
              isPending
                ? "border-l-orange-400 bg-gradient-to-r from-orange-50/80 to-amber-50/60"
                : "hover:bg-muted/50 border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 hover:shadow-md"
            }`}
            onClick={() => !isPending && setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-full ${
                  isPending
                    ? "bg-gradient-to-br from-orange-100 to-amber-100"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100"
                }`}
                animate={iconAnimation}
                transition={iconTransition}
              >
                {isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-4 w-4 text-orange-600" />
                  </motion.div>
                ) : (
                  <IconComponent className="h-4 w-4 text-blue-600" />
                )}
              </motion.div>
              <div className="flex-1">
                <motion.p
                  className={`text-sm font-medium ${isPending ? "text-orange-900" : "text-blue-900"}`}
                  animate={textAnimation}
                  transition={textTransition}
                >
                  {toolCall.description}
                  {isPending && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="ml-2"
                    >
                      ...
                    </motion.span>
                  )}
                </motion.p>
                {!isPending && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-xs text-blue-600 mt-1"
                  >
                    Click to view details
                  </motion.p>
                )}
              </div>
              {!isPending && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="text-blue-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  ▼
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isOpen && !isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="mt-2 overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-l-4 border-l-gray-300 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Tool Name
                      </h4>
                      <code className="text-sm bg-gray-200 px-2 py-1 rounded font-mono">
                        {toolCall.name}
                      </code>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Arguments
                      </h4>
                      <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
                        {JSON.stringify(toolCall.arguments, null, 2)}
                      </pre>
                    </div>
                    {toolCall.result && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Result
                        </h4>
                        <pre className="text-xs bg-gray-800 text-blue-400 p-3 rounded overflow-x-auto">
                          {JSON.stringify(toolCall.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

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
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-3 text-gray-900">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-medium mb-2 text-gray-800">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">{children}</li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-800 text-green-400 p-3 rounded overflow-x-auto mb-3">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                }}
              >
                {message.isStreaming
                  ? message.streamedContent || ""
                  : message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="inline-block w-0.5 h-4 bg-gray-700 ml-0.5"
                />
              )}
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

export function ChatPage() {
  const { messages, sendUserMessage, isTyping } = useMessages();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    sendUserMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-6"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <Card className="p-4 bg-white border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0,
                    }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.2,
                    }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.4,
                    }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </Card>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to help with scheduling, emails, reports, or any admin task..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
