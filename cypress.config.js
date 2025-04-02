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
    },
    setupNodeEvents(on, config) {
      visitedUrlsPlugin(on, config)
      // IMPORTANT to return the config object
      // with the any changed environment variables
      return config
    },
  },
})
