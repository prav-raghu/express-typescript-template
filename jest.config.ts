import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src/tests"],
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts", "!src/tests/**"],
    setupFiles: ["dotenv/config"],
};

export default config;
