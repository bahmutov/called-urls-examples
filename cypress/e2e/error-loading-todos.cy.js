/// <reference types="cypress" />

describe('Todo app', () => {
  it('handles data load errors', () => {
    cy.intercept('GET', '/todos', {
      statusCode: 500,
      body: { error: 'Failed to load todos' },
    }).as('getError')
    cy.visit('app/index.html', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      },
    })
    cy.wait('@getError')
    cy.get('.loaded')
    cy.get('.no-todos').should('be.visible')
    cy.get('@consoleError').should(
      'have.been.calledWith',
      'could not load todos',
    )
  })
})
