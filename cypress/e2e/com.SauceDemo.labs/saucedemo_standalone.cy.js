//###########################################################################################
//# TC ID : 001
//# Suite Description : Validate SauceDemo core functionalities including login, product sorting, 
//                      add/remove cart items, checkout flow, cart persistence, and error validations
//# Created By: Avdhut Satish Shirgaonkar
//# Created Date: 06-April-2025
//###########################################################################################

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
  
    // @tag smoke
    it('TC01 - {@smoke} Validate Incorrect Login Attempt', () => {
      login('incorrect_user', 'incorrect_password');
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('have.text', 'Epic sadface: Username and password do not match any user in this service');
      cy.screenshot('TC01_InvalidLogin');
    });
  
    // @tag regression
    it('TC02 - Add Highest Priced Product to Cart and Checkout', () => {
      login('standard_user', 'secret_sauce');
  
      cy.get('.product_sort_container').select('hilo');
      cy.xpath("//button[text()='Add to cart']").first().click();
      cy.screenshot('TC02_ClickHighestPricedProduct');
  
      cy.get('.shopping_cart_link').click();
      cy.get('button[data-test="checkout"]').click();
  
      fillCheckoutInfo('Albus', 'Severus', '9-3/4');
  
      cy.get('span.title').should('have.text', 'Checkout: Overview');
      cy.get('#finish').click();
      cy.get('.complete-header').should('have.text', 'Thank you for your order!');
      cy.screenshot('TC02_OrderConfirmation');
    });
  
    // @tag regression
    it('TC03 - Add Specific Product and Checkout', () => {
      login('standard_user', 'secret_sauce');
  
      cy.contains('.inventory_item', productName).within(() => {
        cy.contains('Add to cart').click();
      });
      cy.screenshot('TC03_SelectSpecificProduct');

      cy.get('.shopping_cart_link').click();
      cy.get('button[data-test="checkout"]').click();
  
      fillCheckoutInfo('Harry', 'Potter', '7-G');
  
      cy.get('#finish').click();
      cy.get('.complete-header').should('contain.text', 'Thank you for your order!');
      cy.screenshot('TC03_CheckoutWithSpecificProduct');
    });

    // @tag regression
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
        cy.screenshot('TC04_Cancel_Functionality_Checkout');
      });
  
    // @tag regression  
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
      cy.screenshot('TC05_CartWith2Items');
    });
  
    // @tag smoke
    it('TC06 - Validate Logout Functionality', () => {
      login('standard_user', 'secret_sauce');
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').should('be.visible').click();
      cy.url().should('eq', baseUrl);
      cy.screenshot('TC06_LogoutSuccess');
    });

    // @tag regression
    it('TC07 - Verify Product Sorting Functionality', () => {
        login('standard_user', 'secret_sauce');
      
        const sortingOptions = [
          { value: 'az', selector: '.inventory_item_name', order: 'asc' },
          { value: 'za', selector: '.inventory_item_name', order: 'desc' },
          { value: 'lohi', selector: '.inventory_item_price', order: 'asc' },
          { value: 'hilo', selector: '.inventory_item_price', order: 'desc' },
        ];
      
        sortingOptions.forEach((option) => {
          cy.get('.product_sort_container').select(option.value);
      
          cy.get(option.selector).then(($items) => {
            const texts = Cypress._.map($items, (el) => el.innerText.trim());
      
            const sortedTexts = [...texts].sort((a, b) => {
              return option.order === 'asc' ? a.localeCompare(b, undefined, { numeric: true }) : b.localeCompare(a, undefined, { numeric: true });
            });
      
            expect(texts).to.deep.equal(sortedTexts);
          });
        });
      
        cy.screenshot('TC07_ProductSortingVerification');
      });
      
    // @tag regression
      it('TC08 - Verify Product Details Page', () => {
        login('standard_user', 'secret_sauce');
    
        cy.get('.inventory_item').first().within(() => {
          cy.get('.inventory_item_name').click();
        });
    
        cy.url().should('include', '/inventory-item.html');
        cy.get('.inventory_details_name').should('be.visible');
        cy.get('.inventory_details_desc').should('be.visible');
        cy.get('.inventory_details_price').should('be.visible');
    
        cy.screenshot('TC08_ProductDetailsPage');
      });
    
      // @tag regression
      it('TC09 - Validate Error Messages for Checkout Information', () => {
        login('standard_user', 'secret_sauce');
    
        cy.get('.inventory_item').first().within(() => {
          cy.contains('Add to cart').click();
        });
    
        cy.get('.shopping_cart_link').click();
        cy.get('button[data-test="checkout"]').click();
    
        cy.get('#continue').click();
        cy.get('[data-test="error"]').should('have.text', 'Error: First Name is required');
    
        cy.get('#first-name').type('John');
        cy.get('#continue').click();
        cy.get('[data-test="error"]').should('have.text', 'Error: Last Name is required');
    
        cy.get('#last-name').type('Doe');
        cy.get('#continue').click();
        cy.get('[data-test="error"]').should('have.text', 'Error: Postal Code is required');
    
        cy.screenshot('TC09_CheckoutErrorMessages');
      });

      // @tag regression
      it('TC10 - Verify Removing Items from the Cart', () => {
        login('standard_user', 'secret_sauce');
    
        cy.get('.inventory_item').eq(0).within(() => {
          cy.contains('Add to cart').click();
        });
    
        cy.get('.inventory_item').eq(1).within(() => {
          cy.contains('Add to cart').click();
        });
    
        cy.get('.shopping_cart_link').click();
    
        cy.get('.cart_item').first().within(() => {
          cy.contains('Remove').click();
        });
    
        cy.get('.cart_item').should('have.length', 1);
    
        cy.screenshot('TC10_CartAfterRemovingItem');
      });
    
      // @tag smoke
      it('TC11 - Validate Login with Locked-Out User', () => {
        login('locked_out_user', 'secret_sauce');
    
        cy.get('[data-test="error"]').should(
          'have.text',
          'Epic sadface: Sorry, this user has been locked out.'
        );
    
        cy.screenshot('TC11_LockedOutUserLoginAttempt');
      });
    
      // @tag smoke
      it('TC12 - Verify Persistent Cart Contents After Logout/Login', () => {
        login('standard_user', 'secret_sauce');
    
        cy.get('.inventory_item').first().within(() => {
          cy.contains('Add to cart').click();
        });
    
        cy.get('.shopping_cart_badge').should('have.text', '1');
    
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
    
        login('standard_user', 'secret_sauce');
    
        cy.get('.shopping_cart_badge').should('have.text', '1');
    
        cy.screenshot('TC12_CartPersistenceAfterLogoutLogin');
      });

  });
  