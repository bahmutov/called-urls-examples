/// <reference types="cypress" />

describe(
  'Todo app',
  {
    // start with 4 todos right away
    rest: {
      todos: 'todos.json',
    },
  },
  () => {
    it('deletes two todos', () => {
      cy.visit('app/index.html')
      cy.get('li.todo').should('have.length', 4)
      cy.step('Delete the first todo')
      cy.get('li.todo')
        .first()
        .find('.destroy')
        .invoke('show')
        .click()
      cy.get('li.todo').should('have.length', 3)

      cy.step('Delete the last todo')
      cy.get('li.todo').last().find('.destroy').invoke('show').click()
      cy.get('li.todo').should('have.length', 2)
    })
  },
)
