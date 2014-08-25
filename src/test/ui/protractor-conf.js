exports.config = {
    allScriptsTimeout: 11000,

    chromeDriver: '/usr/local/lib/node_modules/protractor/selenium/chromedriver',
    seleniumServerJar: '../../../../../selenium-server-standalone-2.42.2.jar',

    specs: [
        'e2e/*.js'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            args: ['--disable-web-security']
        }
    },

    baseUrl: 'http://localhost:8080/valintalaskenta-ui/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};