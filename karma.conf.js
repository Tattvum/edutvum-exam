// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

// New changes for cli 1.0.0
// https://github.com/angular/angular-cli/wiki/stories-1.0-update#karmaconfjs

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-coveralls'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      captureConsole: true,
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    //https://github.com/karma-runner/karma/issues/2582
    //https://stackoverflow.com/questions/42378254/console-log-not-working-on-any-karma-project
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    files: [
      
    ],
    preprocessors: {
      
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_LOG,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222',
        ],
      }
    },
    singleRun: false
  });
};
