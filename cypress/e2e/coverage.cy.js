describe('App code coverage', { rest: { todos: [] } }, () => {
  it('should have non-zero coverage', () => {
    cy.visit('app/index.html')
    cy.get('.loaded')
    cy.get('input.new-todo').type('Buy milk{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })

  it('should have lower coverage', () => {
    cy.visit('app/index.html')
    cy.get('.loaded')
  })
})
