module.exports = () => {
  return {
    // tell wallaby to use automatic configuration
    autoDetect: true,

    testFramework: {
      // the jest configuration file path
      // (relative to project root)
      configFile: './jest.config.unit.js'
    }
  }
};
