const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.unit.test\\.ts$",
  setupFilesAfterEnv: [],
};

module.exports = config;
