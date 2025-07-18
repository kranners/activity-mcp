import { Page, usePage } from "@/hooks/use-page";
import React from "react";

type PageLinkProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  page: Page;
};

export function PageLink({ page, children, ...props }: PageLinkProps) {
  const { setPage } = usePage();

  const handleClick = () => {
    console.log(`attempting to navigate to ${page}`);
    return setPage(page);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
