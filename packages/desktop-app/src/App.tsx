import { ElectronAPI } from "../electron/preload";
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import './App.css'

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

function App() {
  const [count, setCount] = useState(0)

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
      <div>
        <a href="https://electron-vite.github.io" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={sendPing}>ping</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
