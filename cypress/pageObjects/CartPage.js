class CartPage {
    elements = {
      checkoutButton: () => cy.get('button[data-test="checkout"]')
    };
  
    NavigateToCheckout() {
      this.elements.checkoutButton().click();
    }
  }
  
  export default CartPage;
  