describe('Standalone Cypress Tests for SauceDemo', () => {
    const baseUrl = 'https://www.saucedemo.com/';
    const productName = 'Sauce Labs Backpack';
  
    const login = (username, password) => {
      cy.get('#user-name').type(username);
      cy.get('#password').type(password);
      cy.get('#login-button').click();
    };
  
    const fillCheckoutInfo = (firstName, lastName, postalCode) => {
      cy.get('#first-name').type(firstName);
      cy.get('#last-name').type(lastName);
      cy.get('#postal-code').type(postalCode);
      cy.get('#continue').click();
    };
  
    beforeEach(() => {
      cy.visit(baseUrl);
    });
  
    it('TC01 - Validate Incorrect Login Attempt', () => {
      login('incorrect_user', 'incorrect_password');
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('have.text', 'Epic sadface: Username and password do not match any user in this service');
      cy.screenshot('SA_InvalidLogin');
    });
  
    it('TC02 - Add Highest Priced Product to Cart and Checkout', () => {
      login('standard_user', 'secret_sauce');
  
      cy.get('.product_sort_container').select('hilo');
      cy.xpath("//button[text()='Add to cart']").first().click();
      cy.screenshot('ClickHighestPricedProduct');
  
      cy.get('.shopping_cart_link').click();
      cy.get('button[data-test="checkout"]').click();
  
      fillCheckoutInfo('Albus', 'Severus', '9-3/4');
  
      cy.get('span.title').should('have.text', 'Checkout: Overview');
      cy.get('#finish').click();
      cy.get('.complete-header').should('have.text', 'Thank you for your order!');
      cy.screenshot('OrderConfirmation');
    });
  
    it('TC03 - Add Specific Product and Checkout', () => {
      login('standard_user', 'secret_sauce');
  
      cy.contains('.inventory_item', productName).within(() => {
        cy.contains('Add to cart').click();
      });
      cy.screenshot('SelectSpecificProduct');

      cy.get('.shopping_cart_link').click();
      cy.get('button[data-test="checkout"]').click();
  
      fillCheckoutInfo('Harry', 'Potter', '7-G');
  
      cy.get('#finish').click();
      cy.get('.complete-header').should('contain.text', 'Thank you for your order!');
      cy.screenshot('CheckoutWithSpecificProduct');
    });

    it('TC04 - Verify cancel functionality on Checkout after adding specific product to cart ', () => {
        login('standard_user', 'secret_sauce');
    
        cy.contains('.inventory_item', productName).within(() => {
          cy.contains('Add to cart').click();
        });
  
        cy.get('.shopping_cart_link').click();
        cy.get('button[data-test="checkout"]').click();
    
        fillCheckoutInfo('Harry', 'Potter', '7-G');
        
        cy.get('.title').should('be.visible').and('have.text', "Checkout: Overview");
        cy.get('#cancel').click();
        cy.get('.title').should('be.visible').and('have.text', "Products");
        cy.screenshot('SA_After_Cancel_Btn_Click');
      });
  
      
    it('TC05 - Validate Cart Item Count and Total', () => {
      login('standard_user', 'secret_sauce');
  
      cy.get('.inventory_item').eq(0).within(() => {
        cy.contains('Add to cart').click();
      });
  
      cy.get('.inventory_item').eq(1).within(() => {
        cy.contains('Add to cart').click();
      });
  
      cy.get('.shopping_cart_link').click();
      cy.get('.cart_item').should('have.length', 2);
      cy.screenshot('CartWith2Items');
    });
  
    it('TC06 - Validate Logout Functionality', () => {
      login('standard_user', 'secret_sauce');
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').should('be.visible').click();
      cy.url().should('eq', baseUrl);
      cy.screenshot('LogoutSuccess');
    });
  });
  