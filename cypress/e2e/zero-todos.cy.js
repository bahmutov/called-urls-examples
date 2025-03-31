/// <reference types="cypress" />

describe('Todo app', { rest: { todos: [] } }, () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('.loaded')
  })

  it('shows no todos', () => {
    cy.get('.no-todos').should('be.visible')
  })
})
