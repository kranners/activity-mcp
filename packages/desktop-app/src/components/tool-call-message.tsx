import { Card } from "@/components/ui/card";
import { ToolCall } from "@/hooks/use-messages";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ReactJsonView from "@microlink/react-json-view";
import { cn } from "@/lib/utils";

const PENDING_CARD_ANIMATION = {
  y: [-2, 2, -2],
  boxShadow: [
    "0 8px 25px -5px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05)",
    "0 12px 35px -5px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.1)",
    "0 8px 25px -5px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05)",
  ],
};

const COMPLETED_CARD_ANIMATION = {
  y: [2, 0],
  boxShadow: [
    "0 12px 35px -5px rgba(251, 146, 60, 0.25)",
    "0 4px 6px -1px rgba(59, 130, 246, 0.1)",
  ],
};

const PENDING_CARD_TRANSITION = {
  y: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  },
  boxShadow: {
    duration: 2.5,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  },
};

const COMPLETED_CARD_TRANSITION = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

const PENDING_ICON_ANIMATION = {
  rotate: 360,
};

const COMPLETED_ICON_ANIMATION = {
  scale: [1, 1.2, 1],
  rotate: [0, 5, -5, 0],
};

const PENDING_ICON_TRANSITION = {
  rotate: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear" as const,
  },
};

const COMPLETED_ICON_TRANSITION = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

const PENDING_TEXT_ANIMATION = {
  opacity: [0.8, 1, 0.8],
};

const PENDING_TEXT_TRANSITION = {
  duration: 1.5,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeInOut" as const,
};

const JsonView = ({ src }: { src: object | string }) => {
  const toDisplay = useMemo(() => {
    if (typeof src === "object") {
      return src;
    }

    try {
      return JSON.parse(src);
    } catch (e) {
      console.warn("Got non-JSON response from MCP tool", e);
      return src;
    }
  }, [src]);

  if (typeof toDisplay === "string") {
    return (
      <pre className="text-xs bg-gray-800 text-blue-400 p-3 rounded overflow-x-auto">
        {toDisplay}
      </pre>
    );
  }

  return (
    <ReactJsonView
      src={toDisplay}
      iconStyle="circle"
      theme="ocean"
      indentWidth={2}
      style={{
        padding: "calc(var(--spacing) * 4)",
        borderRadius: "var(--radius-sm)",
      }}
      displayObjectSize
      enableClipboard={false}
      displayDataTypes={false}
      collapsed
      collapseStringsAfterLength={false}
    />
  );
};

export const ToolCallMessage = ({
  toolCall,
  onComplete,
}: {
  toolCall: ToolCall;
  onComplete?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const IconComponent = toolCall.icon;
  const isPending = toolCall.status === "pending";

  useEffect(() => {
    if (toolCall.status === "completed" && !hasCompleted) {
      setHasCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [toolCall.status, hasCompleted, onComplete]);

  const {
    cardAnimation,
    cardTransition,
    iconAnimation,
    iconTransition,
    textAnimation,
    textTransition,
  } = useMemo(() => {
    if (isPending) {
      return {
        cardAnimation: PENDING_CARD_ANIMATION,
        cardTransition: PENDING_CARD_TRANSITION,
        iconAnimation: PENDING_ICON_ANIMATION,
        iconTransition: PENDING_ICON_TRANSITION,
        textAnimation: PENDING_TEXT_ANIMATION,
        textTransition: PENDING_TEXT_TRANSITION,
      };
    }

    if (hasCompleted) {
      return {
        cardAnimation: COMPLETED_CARD_ANIMATION,
        cardTransition: COMPLETED_CARD_TRANSITION,
        iconAnimation: COMPLETED_ICON_ANIMATION,
        iconTransition: COMPLETED_ICON_TRANSITION,
        textAnimation: {},
        textTransition: {},
      };
    }

    return {
      cardAnimation: {},
      cardTransition: {},
      iconAnimation: {},
      iconTransition: {},
      textAnimation: {},
      textTransition: {},
    };
  }, [toolCall.status, isPending, hasCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-4 max-w-2xl mx-auto lg:mx-0"
    >
      <div>
        <motion.div animate={cardAnimation} transition={cardTransition}>
          <Card
            className={cn(
              "p-4 transition-all duration-700 border-l-4 cursor-pointer",
              isPending
                ? "border-l-orange-400 bg-gradient-to-r from-orange-50/80 to-amber-50/60"
                : "hover:bg-muted/50 border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 hover:shadow-md",
            )}
            onClick={() => !isPending && setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className={cn(
                  "p-2 rounded-full",
                  isPending
                    ? "bg-gradient-to-br from-orange-100 to-amber-100"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100",
                )}
                animate={iconAnimation}
                transition={iconTransition}
              >
                {isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-4 w-4 text-orange-600" />
                  </motion.div>
                ) : (
                  <IconComponent className="h-4 w-4 text-blue-600" />
                )}
              </motion.div>
              <div className="flex-1">
                <motion.p
                  className={cn(
                    "text-sm font-medium",
                    isPending ? "text-orange-900" : "text-blue-900",
                  )}
                  animate={textAnimation}
                  transition={textTransition}
                >
                  {toolCall.description}
                  {isPending && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{
                        duration: 1.2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="ml-2"
                    >
                      ...
                    </motion.span>
                  )}
                </motion.p>
                {!isPending && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-xs text-blue-600 mt-1"
                  >
                    Click to view details
                  </motion.p>
                )}
              </div>
              {!isPending && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="text-blue-600"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  ▼
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isOpen && !isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="mt-2 overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-l-4 border-l-gray-300 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Tool Name
                      </h4>
                      <code className="text-sm bg-gray-200 px-2 py-1 rounded font-mono">
                        {toolCall.name}
                      </code>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Arguments
                      </h4>
                      <JsonView src={toolCall.arguments} />
                    </div>
                    {toolCall.result && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Result
                        </h4>
                        <JsonView src={toolCall.result} />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
