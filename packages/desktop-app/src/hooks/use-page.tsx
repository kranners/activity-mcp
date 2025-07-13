import React, { createContext, useContext, useState } from "react";

export type Page = "chat" | "settings" | "support" | "feedback";

const DEFAULT_PAGE: Page = "chat";

type PageContextProps = {
  page: Page;
  setPage: (page: Page) => void;
};

const PageContext = createContext<PageContextProps | null>(null);

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePage must be used within a PageProvider.");
  }

  return context;
}

export function PageProvider({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [page, setPage] = useState<Page>(DEFAULT_PAGE);

  return (
    <PageContext.Provider value={{ page, setPage }} {...props}>
      {children}
    </PageContext.Provider>
  );
}
