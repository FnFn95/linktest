context('TestOnline', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8090/#/onlineHandling')
  })

  it('can add numbers', function() {

    cy.get('input[name="sqdw"]')
      .type('2222').should('have.value', '2222');
    cy.get('input[name="dwdz"]')
      .type('3333').should('have.value', '3333')
  })
})
