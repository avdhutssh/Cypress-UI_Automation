class CartPage {
  elements = {
    checkoutButton: () => cy.get('button[data-test="checkout"]'),
    cartItems: () => cy.get('.cart_item')
  };

  NavigateToCheckout() {
    this.elements.checkoutButton().click();
  }
}

export default CartPage;
