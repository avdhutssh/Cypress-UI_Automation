class InventoryPage {
    elements = {
      productSortDropdown: () => cy.get('.product_sort_container'),
      addToCartButton: (productName) => cy.contains('.inventory_item', productName).find('button'),
      shoppingCartLink: () => cy.get('.shopping_cart_link'),
      addFirstProductToCart: () => cy.get('button[data-test^="add-to-cart"]').first()
    };
  
    sortProducts(order) {
      this.elements.productSortDropdown().select(order);
    }
  
    addProductToCart(productName) {
      this.elements.addToCartButton(productName).click();
    }
  
    addFirstProductToCart() {
      this.elements.addFirstProductToCart().click();
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
  }

  export default InventoryPage;
  