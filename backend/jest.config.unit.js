const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.unit.test\\.ts$",
  setupFilesAfterEnv: ["jest-extended/all"],
};

module.exports = config;
