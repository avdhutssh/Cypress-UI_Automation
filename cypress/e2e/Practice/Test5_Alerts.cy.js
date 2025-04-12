describe('Advanced UI Elements', function () {

    it('Simple alert', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.contains('Click for JS Alert').click();
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.equal('I am a JS Alert');
        })
        cy.get('#result').should('contain', 'You successfully clicked an alert');
    })

    it('Confirmation alert - Ok button', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.contains('Click for JS Confirm').click();
        cy.on('window:confirm', (alertText) => {
            expect(alertText).to.equal('I am a JS Confirm');
        })
        cy.get('#result').should('contain', 'You clicked: Ok')
    })

    it('Confirmation alert - Cancel button', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.contains('Click for JS Confirm').click();
        cy.on('window:confirm', (alertText) => {
            expect(alertText).to.equal('I am a JS Confirm');
            return false;
        })
        cy.get('#result').should('contain', 'You clicked: Cancel')
    })

    it('Promt Alert - Enter Text', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns('Hello Avdhut');
            cy.contains('Click for JS Prompt').click();
        })

        cy.get('#result').should('contain', 'You entered: Hello Avdhut')
    })

    it('Promt Alert - Click Ok', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns('');
            cy.contains('Click for JS Prompt').click();
        })

        cy.get('#result').should('contain', 'You entered:')
    })

    it('Promt Alert - Click Cancel', function () {
        cy.visit("https://the-internet.herokuapp.com/javascript_alerts");
        cy.window().then((win) => {
            cy.stub(win, 'prompt').returns(null);
            cy.contains('Click for JS Prompt').click();
        })

        cy.get('#result').should('contain', 'You entered: null')
    })
})