import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PageProvider } from "@/hooks/use-page.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { MessageProvider } from "@/hooks/use-messages.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PageProvider>
      <SidebarProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </SidebarProvider>
    </PageProvider>
  </React.StrictMode>,
);
