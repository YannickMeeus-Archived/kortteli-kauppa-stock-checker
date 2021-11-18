const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.int.test\\.ts$",
  setupFilesAfterEnv: [],
};

module.exports = config;
