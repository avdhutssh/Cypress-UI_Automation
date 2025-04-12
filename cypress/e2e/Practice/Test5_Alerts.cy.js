describe('Advanced UI Elements', function () {

    it('Simple alert', function () {
        cy.visit("");
        cy.contains('Click for JS Alert').click();
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.equal('I am a JS Alert');
        })
        cy.get('#result').should('contain', 'You successfully clicked an alert');
    })

    it('Confirmation alert - Ok button', function () {
        cy.visit("");
        cy.contains('Click for JS Confirm').click();
        cy.on('window:alert', (alertText) => {
            (alertText).to.equal('I am a JS Confirm');
        })
        cy.get('#result').should('contain', 'You clicked: Ok')
    })

    it('Confirmation alert - Cancel button', function () {
        cy.visit("");
        cy.contains('Click for JS Confirm').click();
        cy.on('window:alert', (alertText) => {
            (alertText).to.equal('I am a JS Confirm');
            return false;
        })
        cy.get('#result').should('contain', 'You clicked: Cancel')
    })

    it('Promt Alert - Enter Text', function () {
        cy.visit("");
        cy.window().then((win) => {
            cy.stub(win, 'promt').returns('Hello Avdhut');
            cy.contains('Click for JS Prompt').click();
        })

        cy.get('#result').should('contain', 'You entered: Hello Avdhut')
    })
})