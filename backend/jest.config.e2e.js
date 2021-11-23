const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.e2e.test\\.ts$",
};

module.exports = config;
