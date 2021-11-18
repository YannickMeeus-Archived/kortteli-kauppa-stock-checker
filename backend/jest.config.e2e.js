const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.e2e.test\\.ts$",
  maxWorkers: 1,
};

module.exports = config;
