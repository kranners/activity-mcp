import { ElectronAPI } from "@/electron/preload";
import React from "react";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { usePage } from "@/hooks/use-page";
import ChatPage from "@/pages/chat";
import SettingsPage from "@/pages/settings";
import { IntegrationsPage } from "@/pages/integrations";

export default function App() {
  const { page } = usePage();

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {page === "chat" && <ChatPage />}
          {page === "settings" && <SettingsPage />}
          {page === "integrations" && <IntegrationsPage />}
        </div>
      </SidebarInset>
    </>
  );
}
