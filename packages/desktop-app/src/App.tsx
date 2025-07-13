import { ElectronAPI } from "@/electron/preload";
import React, { useEffect } from "react";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

import {
  MessageCircle,
  Settings,
  Bot,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import SettingsPage from "@/pages/settings";
import ChatPage from "@/pages/chat";
import { useState } from "react";

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

function AppContent() {
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [chatExpanded, setChatExpanded] = useState(true);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="border-r" collapsible="icon">
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
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "chat"}
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

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

      <SidebarInset>
        <div>
          {activeTab === "chat" && <ChatPage selectedConversation={selectedConversation} />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </SidebarInset>
    </div>
  );
}

export default function DesktopChatbotClient() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}
