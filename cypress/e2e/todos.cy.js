/// <reference types="cypress" />

describe('Todo app', () => {
  it('shows no todos', { rest: { todos: [] } }, () => {
    cy.visit('app/index.html')
    cy.get('.loaded')
    cy.get('.no-todos').should('be.visible')
  })

  it('adds a todo', { rest: { todos: [] } }, () => {
    cy.visit('app/index.html')
    cy.get('.loaded')
    cy.get('.new-todo').type('Buy milk{enter}')
    cy.get('li.todo').should('have.length', 1)
  })

  it(
    'clears completed todos',
    { rest: { todos: 'todos.json' } },
    () => {
      cy.visit('app/index.html')
      cy.get('li.todo')
        .should('have.length', 4)
        .first()
        .find('.toggle')
        .click()
      cy.get('li.todo').first().should('have.class', 'completed')
      cy.get('.clear-completed').click()
      cy.get('li.todo').should('have.length', 3)
    },
  )

  it('removes a todo', { rest: { todos: 'todos.json' } }, () => {
    cy.visit('app/index.html')
    cy.get('li.todo')
      .should('have.length', 4)
      .first()
      .find('.destroy')
      .invoke('show')
      .click()
    cy.get('li.todo').should('have.length', 3)
  })

  it('shows filters', { rest: { todos: 'completed.json' } }, () => {
    cy.visit('app/index.html')
    cy.get('li.todo').should('have.length', 4)
    cy.get('.filters').should('be.visible')
    cy.get('.filters').contains('Active').click()
    cy.get('li.todo').should('have.length', 3)
    cy.get('.filters').contains('Completed').click()
    cy.get('li.todo').should('have.length', 1)
    cy.get('.filters').contains('All').click()
    cy.get('li.todo').should('have.length', 4)
  })

  it('goes to all todos on incorrect hash', () => {
    cy.visit('app/index.html#/unknown', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError')
      },
    })
    cy.get('.loaded')
    cy.contains('a', 'All').should('have.class', 'selected')
    cy.get('@consoleError').should(
      'have.been.calledWith',
      'could not load todos',
    )

    cy.step('Try adding a blank todo')
    cy.get('input.new-todo').type('{enter}')
    cy.get('@consoleError').should(
      'have.been.calledWith',
      'Cannot add a blank todo',
    )
  })
})
