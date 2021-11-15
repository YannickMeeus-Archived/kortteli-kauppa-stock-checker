import type { Config } from "@jest/types";
import baseConfig from "./jest.config";

const config: Config.InitialOptions = {
  ...baseConfig,
  testRegex: ".*\\.e2e.test.ts$",
  testTimeout: 30000,
  verbose: true,
  maxWorkers: 1,
};
export default config;
