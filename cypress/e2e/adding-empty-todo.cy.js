/// <reference types="cypress" />

describe('Todo app', { rest: { todos: [] } }, () => {
  it('does not add an empty todo', () => {
    cy.visit('app/index.html', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      },
    })
    cy.get('.loaded')
    cy.get('.no-todos').should('be.visible')
    cy.get('.new-todo').type('{enter}')
    cy.get('.new-todo').should('have.value', '')
    cy.get('@consoleError').should(
      'have.been.calledWith',
      'Cannot add a blank todo',
    )
  })
})
