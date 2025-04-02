const { defineConfig } = require('cypress')

// https://github.com/bahmutov/cypress-visited-urls
const visitedUrlsPlugin = require('cypress-visited-urls/src/plugin')

module.exports = defineConfig({
  defaultBrowser: 'electron',
  e2e: {
    experimentalRunAllSpecs: true,
    env: {
      visitedUrls: {
        // collect each URL the test runner visits
        // https://glebbahmutov.com/blog/collect-tested-urls/
        collect: true,
        urlsFilename: 'cypress-visited-urls.json',
      },
      coverage: {
        instrument: '**/app/*.js',
      },
    },
    setupNodeEvents(on, config) {
      visitedUrlsPlugin(on, config)

      // https://github.com/bahmutov/cypress-code-coverage
      require('@bahmutov/cypress-code-coverage/plugin')(on, config)

      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },
})
