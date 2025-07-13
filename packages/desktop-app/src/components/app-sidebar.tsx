import * as React from "react";
import {
  Bot,
  LifeBuoy,
  LucideIcon,
  MessageCircle,
  Send,
  Settings2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Page } from "@/hooks/use-page";

export type NavItem = {
  title: string;
  page: Page;
  icon: LucideIcon;
  isActive?: boolean;
};

export type NestedNavItem = NavItem & {
  items?: Omit<NavItem, "items" | "isActive">[];
};

export type User = {
  name: string;
  email: string;
  avatar: string;
};

type SidebarData = {
  user: User;
  navMain: NestedNavItem[];
  navSecondary: NavItem[];
};

const SIDEBAR_STATIC_DATA: SidebarData = {
  user: {
    name: "nerd",
    email: "nerd@example.com",
    avatar: "/vite.svg",
  },
  navMain: [
    {
      title: "Chat",
      page: "chat",
      icon: MessageCircle,
      isActive: true,
    },
    {
      title: "Settings",
      page: "settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      page: "support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      page: "feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Bot className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Ally</span>
                <span className="truncate text-xs">v0.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_STATIC_DATA.navMain} />
        <NavSecondary
          items={SIDEBAR_STATIC_DATA.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR_STATIC_DATA.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
