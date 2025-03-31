/// <reference types="cypress" />

describe('Todo app', { rest: { todos: [] } }, () => {
  beforeEach(() => {
    cy.visit('app/index.html')
    cy.get('.loaded')
  })

  it('shows no todos', () => {
    cy.get('.no-todos').should('be.visible')
  })

  it('adds a todo', () => {
    cy.get('.new-todo').type('Buy milk{enter}')
    cy.get('li.todo').should('have.length', 1)
    cy.step('Reload the page')
    cy.reload()
    cy.get('li.todo').should('have.length', 1)
  })
})
