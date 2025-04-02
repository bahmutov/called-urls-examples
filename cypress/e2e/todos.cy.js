/// <reference types="cypress" />

describe('Todo app', () => {
  it('shows no todos', () => {
    cy.visit('app/index.html')
  })
})
