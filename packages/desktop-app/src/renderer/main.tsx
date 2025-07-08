import { ElectronAPI } from "../preload";
import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { useState } from "react";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

const App = () => {
  const [count, setCount] = useState(0);

  const sendPing = () => {
    const pong = window.electronAPI.ping(count);
    console.log("ping", pong);
  };

  useEffect(() => {
    window.electronAPI.onUpdateCounter((value) => {
      setCount(count + value);
    });
  });

  return (
    <>
      <h1>hmr!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={sendPing}>ping</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
