class CheckoutPage {
  elements = {
    firstNameInput: () => cy.get('#first-name'),
    lastNameInput: () => cy.get('#last-name'),
    postalCodeInput: () => cy.get('#postal-code'),
    continueButton: () => cy.get('#continue'),
    finishButton: () => cy.get('#finish'),
    completeHeader: () => cy.get('.complete-header'),
    cancelBtn: () => cy.get('#cancel'),
    titleHeader: () => cy.get('.title')
  };

  fillCheckoutInformation(firstName, lastName, postalCode) {
    this.elements.firstNameInput().type(firstName);
    this.elements.lastNameInput().type(lastName);
    this.elements.postalCodeInput().type(postalCode);
    this.elements.continueButton().click();
  }

  completeCheckout() {
    this.elements.finishButton().click();
  }

  ProceedCheckoutByFillingDetails(firstName, lastName, postalCode) {
    this.fillCheckoutInformation(firstName, lastName, postalCode);
    this.completeCheckout();
  }

  cancelCheckout() {
    this.elements.cancelBtn().click();
  }
}

export default CheckoutPage;
