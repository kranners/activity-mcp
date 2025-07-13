import React from "react";
import {
  Send,
  Bot,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

type Conversation = {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
}

type ChatPageProps = { selectedConversation: Conversation };

function ChatPage({ selectedConversation }: ChatPageProps) {
  const [message, setMessage] = React.useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message logic here
      setMessage("");
    }
  };

  return (
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
                  className={`rounded-lg p-3 ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                    }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${msg.role === "user"
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
