describe('Ask question', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('When signed in and ask a valid question, the question should successfully save', () => {
    cy.contains('Unanswered Questions');
    // cy.contains('Sign In').click();
    // cy.url().should('include', 'auth0');

    // cy.findByLabelText('Email')
    //   .type('ali.nisar87@gmail.com')
    //   .should('have.value', 'ali.nisar87@gmail.com');

    // cy.findByLabelText('Password')
    //   .type('your password')
    //   .should('have.value', 'your password');

    // cy.get('form').submit();

    // cy.contains('Unanswered Questions');
  });
});
