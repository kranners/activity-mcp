import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testPathIgnorePatterns: [
    "/.direnv/",
    "/node_modules/",
    "/dist/",
    "/.{git,cache,output,temp}/",
    "/.config/",
  ],
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

export default config;
