// https://github.com/bahmutov/cypress-rest-easy
import 'cypress-rest-easy'

// https://glebbahmutov.com/blog/collect-tested-urls/
import { configureVisitedUrls } from 'cypress-visited-urls'

import 'cypress-plugin-steps'

configureVisitedUrls()

beforeEach(function () {
  if (Cypress.addVisitedTestEvent) {
    cy.intercept(
      {
        resourceType: 'xhr',
      },
      (req) => {
        const parsed = new URL(req.url)
        console.log('intercepted', req.method, parsed.pathname)
        Cypress.addVisitedTestEvent({
          label: 'API',
          data: { method: req.method, pathname: parsed.pathname },
        })
      },
    )
  }
})
