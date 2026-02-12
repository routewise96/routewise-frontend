const nextJest = require("next/jest")

const createJestConfig = nextJest({ dir: __dirname })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  forceExit: true,
  moduleNameMapper: {
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/*.test.[jt]s?(x)"],
  collectCoverageFrom: ["src/features/**/*.{ts,tsx}", "!**/*.d.ts", "!**/index.ts"],
}

module.exports = createJestConfig(customJestConfig)
