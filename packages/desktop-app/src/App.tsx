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
    <div className="flex flex-row justify-center items-center h-screen w-screen bg-red-200">
      <h1>Vite + React</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={sendPing}>ping</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
