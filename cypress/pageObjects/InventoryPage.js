class InventoryPage {
  elements = {
    productSortDropdown: () => cy.get('.product_sort_container'),
    addToCartButton: (productName) => cy.contains('.inventory_item', productName).find('button'),
    shoppingCartLink: () => cy.get('.shopping_cart_link'),
    addFirstProductToCart: () => cy.get('button[data-test^="add-to-cart"]').first(),
    addToCartButtonIndex: () => cy.get('.inventory_item'),
    openMenuLabel: () => cy.get('#react-burger-menu-btn'),
    logoutLabel: () => cy.get('#logout_sidebar_link'),
    productName: () => cy.get('.inventory_details_name'),
    productDescription: () => cy.get('.inventory_details_desc'),
    productPrice: () => cy.get('.inventory_details_price'),
  };

  sortProducts(order) {
    this.elements.productSortDropdown().select(order);
  }

  verifySorting(option){
    cy.get(option.selector).then(($items) => {
      const texts = Cypress._.map($items, (el) => el.innerText.trim());

      const sortedTexts = [...texts].sort((a, b) => {
        return option.order === 'asc' ? a.localeCompare(b, undefined, { numeric: true }) : b.localeCompare(a, undefined, { numeric: true });
      });

      expect(texts).to.deep.equal(sortedTexts);
    });
  }
  addProductToCart(productName) {
    this.elements.addToCartButton(productName).click();
  }

  addFirstProductToCart() {
    this.elements.addFirstProductToCart().click();
  }

  addProductToCartByIndex(index) {
    this.elements.addToCartButtonIndex().eq(index).within(() => {
      cy.contains('Add to cart').click();
    })
  }

  navigateToCart() {
    this.elements.shoppingCartLink().click();
  }

  SelectHighestPricedProduct() {
    this.sortProducts('hilo');
    this.addFirstProductToCart();
    this.navigateToCart();
  }

  addSpecificProductToCart(productName) {
    cy.contains('.inventory_item', productName).within(() => {
      cy.contains('Add to cart').click();
    });
  }

  navigateToFirstProductDetails() {
    this.elements.addToCartButtonIndex().first().find('.inventory_item_name').click();
  }

  verifyProductDetailsVisible() {
    cy.url().should('include', '/inventory-item.html');
    this.elements.productName().should('be.visible');
    this.elements.productDescription().should('be.visible');
    this.elements.productPrice().should('be.visible');
  }

  logout(){
    this.elements.openMenuLabel().click();
    this.elements.logoutLabel().should('be.visible').click();
  }
}

export default InventoryPage;
