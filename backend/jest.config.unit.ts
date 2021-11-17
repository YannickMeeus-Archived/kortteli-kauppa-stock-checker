import type { Config } from "@jest/types";
import baseConfig from "./jest.config";
const config: Config.InitialOptions = {
  ...baseConfig,
  testRegex: "\\.unit.test\\.ts$",
  setupFilesAfterEnv: [],
};
export default config;
