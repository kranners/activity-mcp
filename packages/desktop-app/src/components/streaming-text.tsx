import React from "react";

export const StreamingText = ({
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

  return <span className={className}>{displayContent}</span>;
};
