import { Button } from "@/components/ui/button";
import { ElectronAPI } from "@/electron/preload";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

function App() {
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
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="p-4 flex flex-col rounded-lg shadow-lg gap-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Vite + React
        </h1>
        <div className="flex gap-4">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <Button onClick={sendPing}>ping</Button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
