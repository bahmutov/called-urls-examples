/// <reference types="cypress" />

describe(
  'Navigation',
  {
    // start with three todos, some completed and some not
    rest: {
      todos: [
        { id: '1', title: 'Buy milk', completed: false },
        { id: '2', title: 'Learn Cypress', completed: true },
        { id: '3', title: 'Write tests', completed: false },
      ],
    },
  },
  () => {
    it('shows all, active, and completed todos', () => {
      cy.visit('app/index.html')

      // Check initial state - should have 3 todos
      cy.step('Verify all todos are displayed initially')
      cy.get('li.todo').should('have.length', 3)

      // Check active filter
      cy.step('Filter to show only active todos')
      cy.contains('a', 'Active').click()
      cy.get('li.todo').should('have.length', 2)
      cy.get('li.todo.completed').should('have.length', 0)

      // Check completed filter
      cy.step('Filter to show only completed todos')
      cy.contains('a', 'Completed').click()
      cy.get('li.todo').should('have.length', 1)
      cy.get('li.todo.completed').should('have.length', 1)

      // Go back to all
      cy.step('Return to all todos view')
      cy.contains('a', 'All').click()
      cy.get('li.todo').should('have.length', 3)
    })

    it('navigates to all todos on invalid URL', () => {
      cy.visit('app/index.html#invalid-url')
      cy.location('hash').should('equal', '#')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('a', 'All')
        .should('be.visible')
        .and('have.class', 'selected')
    })
  },
)
