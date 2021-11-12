import type { Config } from "@jest/types";
import baseConfig from "./jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  testRegex: ".*\\.e2e.test.ts$",
  testTimeout: 30000,
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/__tests__/lifecycle/setup.ts"],
};
export default config;
