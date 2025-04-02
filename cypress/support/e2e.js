// https://github.com/bahmutov/cypress-rest-easy
import 'cypress-rest-easy'

// https://glebbahmutov.com/blog/collect-tested-urls/
import { configureVisitedUrls } from 'cypress-visited-urls'

import 'cypress-plugin-steps'

// https://github.com/bahmutov/cypress-code-coverage
import '@bahmutov/cypress-code-coverage/support'

configureVisitedUrls()

beforeEach(function () {
  // this method comes from the plugin
  // https://github.com/bahmutov/cypress-visited-urls
  if (Cypress.addVisitedTestEvent) {
    cy.intercept(
      {
        resourceType: 'xhr',
      },
      (req) => {
        const method = req.method
        const parsed = new URL(req.url)

        let pathname = parsed.pathname
        // remove the random part of the pathname
        if (/\/todos\/\d+/.test(pathname)) {
          pathname = '/todos/:id'
        }
        console.log('intercepted', method, pathname)

        Cypress.addVisitedTestEvent({
          label: 'API',
          data: { method, pathname },
        })
      },
    )
  }
})
