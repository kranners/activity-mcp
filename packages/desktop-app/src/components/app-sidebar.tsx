import React from "react";
import {
  Bot,
  MessageCircle,
  Settings2,
  User,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePage } from "@/hooks/use-page";

// Mock data for conversations
const conversations = [
  "Project Planning & Timeline Setup",
  "Code Review Automation",
  "Team Standup Summary",
  "Bug Triage & Priority Analysis",
  "Documentation Generation",
  "Performance Optimization Research",
  "API Integration Planning",
  "Database Schema Design",
];

function AppSidebar() {
  const { page, setPage } = usePage();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">TaskMind AI</h1>
            <p className="text-xs text-muted-foreground">
              Intelligent Task Assistant
            </p>
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
                  onClick={() => setPage("chat")}
                  isActive={page === "chat"}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setPage("integrations")}
                  isActive={page === "integrations"}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Integrations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setPage("settings")}
                  isActive={page === "settings"}
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.slice(0, 6).map((conversation, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="text-xs">
                    <MessageCircle className="h-3 w-3" />
                    <span className="truncate">{conversation}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">
              john@example.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export { AppSidebar };
