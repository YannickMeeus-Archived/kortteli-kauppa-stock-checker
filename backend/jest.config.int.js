const baseConfig = require('./jest.config')

const config = {
  ...baseConfig,
  testRegex: "\\.int.test\\.ts$",
  maxWorkers: 1,
};

module.exports = config;
