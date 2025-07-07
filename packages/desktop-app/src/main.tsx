import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>hmr!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
