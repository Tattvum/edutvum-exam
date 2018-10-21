// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
//var SpecReporter = require('jasmine-spec-reporter');
//https://stackoverflow.com/questions/43001079/specreporter-is-not-a-constructor-error-when-running-protractor-using-angular-cl
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;


exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    chromeOptions: {
      args: [ "--headless", "--window-size=800x600" ]
    },
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.json'
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
