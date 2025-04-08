describe('Dropdown Functionality',function(){
 
    it('Handling Static DropDown',function(){
        cy.visit('https://seleniumbase.io/demo_page');
        cy.get('#mySelect').select('Set to 100%').should('have.value','100%');
        cy.get('#mySelect').select('75%').should('have.value','75%');
        cy.get('#mySelect').select(0).should('have.value','25%');
    });
});