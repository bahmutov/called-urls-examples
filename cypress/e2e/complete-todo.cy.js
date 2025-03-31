/// <reference types="cypress" />

describe(
  'Todo app',
  {
    rest: {
      todos: [{ id: '1', title: 'Buy milk', completed: false }],
    },
  },
  () => {
    it('completes a todo', () => {
      cy.visit('app/index.html')
      cy.get('li.todo').should('have.length', 1)
      cy.get('li.todo').first().find('.toggle').check()
      cy.get('li.todo').first().should('have.class', 'completed')
      cy.step('Clear completed')
      cy.get('.clear-completed').click()
      cy.get('li.todo').should('have.length', 0)
      cy.get('.no-todos').should('be.visible')
    })
  },
)
