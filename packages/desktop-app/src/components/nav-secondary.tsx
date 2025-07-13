import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItem } from "@/components/app-sidebar";
import { usePage } from "@/hooks/use-page";

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { page, setPage } = usePage();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                size="sm"
                isActive={page === item.page}
                onClick={() => setPage(item.page)}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
