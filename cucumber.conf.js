var env = require('./environment.js');

// A small suite to make sure the cucumber framework works.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'cucumber',

  // Spec patterns are relative to this directory.
  specs: [
    'cucumber/*.feature'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  },
  cucumberOpts: {
    require: 'cucumber/stepDefinitions.js',
    format: 'summary'
  }
};
