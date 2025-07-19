import React, { createContext, useContext, useEffect, useState } from "react";

type SlackUserInfo = {
  avatar: string;
  name: string;
};

export type SlackIntegration = {
  connected: boolean;

  disconnect: () => void;
  connect: () => void;

  user?: SlackUserInfo;
};

const SlackContext = createContext<SlackIntegration | null>(null);

export function useSlack() {
  const context = useContext(SlackContext);

  if (!context) {
    throw new Error("usePage must be used within a SlackProvider.");
  }

  return context;
}

export function SlackProvider({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [user, setUser] = useState<SlackUserInfo | undefined>();
  const [connected, setConnected] = useState<boolean>(false);

  const connect = () => window.electronAPI.connectSlackIntegration();
  const disconnect = () => window.electronAPI.disconnectSlackIntegration();

  useEffect(() => {
    window.electronAPI.onReceiveSlackIntegration((newUser?: SlackUserInfo) => {
      if (newUser === undefined) {
        setUser(undefined);
        setConnected(false);

        return;
      }

      if (newUser === user) {
        return;
      }

      console.log("Setting the user!");

      setUser(newUser);
      setConnected(true);
    });
  });

  return (
    <SlackContext.Provider
      value={{ connect, disconnect, user, connected }}
      {...props}
    >
      {children}
    </SlackContext.Provider>
  );
}
