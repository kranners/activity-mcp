/// <reference types="vite-plugin-electron/electron-env" />

import { ElectronAPI } from "./preload"

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
