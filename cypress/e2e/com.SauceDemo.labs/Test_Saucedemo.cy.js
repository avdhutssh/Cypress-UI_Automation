//###########################################################################################
//# TC ID : 002
//# Suite Description : Validate SauceDemo core functionalities including login, product sorting, 
//                      add/remove cart items, checkout flow, cart persistence, and error validations
//# Created By: Avdhut Satish Shirgaonkar
//# Created Date: 06-April-2025
//###########################################################################################

import pages from '../../pageObjects/PageManager';

describe('SauceDemo E2E Tests', () => {
  let testData;

  before(() => {
    cy.fixture('testdataSauceDemo').then((data) => {
      testData = data;
    });
  });

  beforeEach(() => {
    cy.visit(testData.baseURL);
  });

  it('TC01 - Validate Incorrect Login Attempt', () => {
    pages.loginPage.login(testData.users.invalid.username, testData.users.invalid.password);
    cy.verifyMessage(pages.loginPage.elements.errorMessage, 'Epic sadface: Username and password do not match any user in this service');
    cy.screenshot('TC01_InvalidLogin');
  });

  it('TC02 - Add Highest Priced Product to Cart and Checkout', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.SelectHighestPricedProduct();
    pages.cartPage.NavigateToCheckout();
    pages.checkoutPage.ProceedCheckoutByFillingDetails(testData.checkoutInfo.valid.firstName, testData.checkoutInfo.valid.lastName, testData.checkoutInfo.valid.postalCode);
    cy.verifyMessage(pages.checkoutPage.elements.completeHeader, 'Thank you for your order!');
    cy.screenshot('TC02_OrderConfirmation');
  });

  it('TC03 - Add Specific Product and Checkout', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addSpecificProductToCart(testData.products.productName);
    pages.inventoryPage.navigateToCart();
    cy.screenshot('TC03_SelectSpecificProduct');
    pages.cartPage.NavigateToCheckout();
    pages.checkoutPage.ProceedCheckoutByFillingDetails(testData.checkoutInfo.valid.firstName, testData.checkoutInfo.valid.lastName, testData.checkoutInfo.valid.postalCode);
    cy.verifyMessage(pages.checkoutPage.elements.completeHeader, 'Thank you for your order!');
    cy.screenshot('TC03_CheckoutWithSpecificProduct');
  });

  it('TC04 - Verify cancel functionality on Checkout after adding specific product to cart', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addSpecificProductToCart(testData.products.productName);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.NavigateToCheckout();
    pages.checkoutPage.fillCheckoutInformation(testData.checkoutInfo.valid.firstName, testData.checkoutInfo.valid.lastName, testData.checkoutInfo.valid.postalCode);
    cy.verifyMessage(pages.checkoutPage.elements.titleHeader, 'Checkout: Overview');
    pages.checkoutPage.cancelCheckout();
    cy.verifyMessage(pages.checkoutPage.elements.titleHeader, 'Products');
    cy.screenshot('TC04_Cancel_Functionality_Checkout');
  });

  it('TC05 - Validate Cart Item Count and Total', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addProductToCartByIndex(0);
    pages.inventoryPage.addProductToCartByIndex(1);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.elements.cartItems().should('have.length', 2);
    cy.screenshot('TC05_CartWith2Items');
  });

  it('TC06 - Validate Logout Functionality', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.logout();
    cy.url().should('eq', testData.baseURL);
    cy.screenshot('TC06_LogoutSuccess');
  });

  it('TC07 - Verify Product Sorting Functionality', () => {

    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);

    const sortingOptions = [
      { value: 'az', selector: '.inventory_item_name', order: 'asc' },
      { value: 'za', selector: '.inventory_item_name', order: 'desc' },
      { value: 'lohi', selector: '.inventory_item_price', order: 'asc' },
      { value: 'hilo', selector: '.inventory_item_price', order: 'desc' },
    ];

    sortingOptions.forEach((option) => {
      pages.inventoryPage.sortProducts(option.value);
      pages.inventoryPage.verifySorting(option);
    });

    cy.screenshot('TC07_ProductSortingVerification');
  });

  it('TC08 - Verify Product Details Page', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.navigateToFirstProductDetails();
    pages.inventoryPage.verifyProductDetailsVisible();
    cy.screenshot('TC08_ProductDetailsPage');
  });

  it('TC09 - Validate Error Messages for Checkout Information', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addSpecificProductToCart(testData.products.productName);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.NavigateToCheckout();
    pages.checkoutPage.ClickOnContinue();
    cy.screenshot('TC09_CheckoutErrorMessages');
    cy.verifyMessage(pages.checkoutPage.elements.errorField, 'Error: First Name is required');
    pages.checkoutPage.enterFirstNameAndContinue("Avdhut");
    cy.verifyMessage(pages.checkoutPage.elements.errorField, 'Error: Last Name is required');
    pages.checkoutPage.enterLastNameAndContinue("Shirgaonkar");
    cy.verifyMessage(pages.checkoutPage.elements.errorField, 'Error: Postal Code is required');
    pages.checkoutPage.enterpostalCodeInputAndContinue("411057");
    cy.verifyMessage(pages.checkoutPage.elements.titleHeader, 'Checkout: Overview');
  });

  it('TC10 - Verify Removing Items from the Cart', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addProductToCartByIndex(0);
    pages.inventoryPage.addProductToCartByIndex(1);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.elements.cartItems().should('have.length', 2);
    pages.cartPage.removeFirstItem();
    pages.cartPage.elements.cartItems().should('have.length', 1);
    cy.screenshot('TC10_CartAfterRemovingItem');
  });

  it('TC11 - Validate Login with Locked-Out User', () => {
    pages.loginPage.login(testData.users.lockedOut.username, testData.users.lockedOut.password);
    cy.verifyMessage(pages.loginPage.elements.errorMessage, 'Epic sadface: Sorry, this user has been locked out.');
    cy.screenshot('TC11_LockedOutUserLoginAttempt');
  });

  it('TC12 - Verify Persistent Cart Contents After Logout/Login', () => {
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.addProductToCartByIndex(0);
    pages.inventoryPage.addProductToCartByIndex(1);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.elements.cartItems().should('have.length', 2);
    pages.inventoryPage.logout();
    pages.loginPage.login(testData.users.standard.username, testData.users.standard.password);
    pages.inventoryPage.navigateToCart();
    pages.cartPage.elements.cartItems().should('have.length', 2);
    cy.screenshot('TC12_CartPersistenceAfterLogoutLogin');
  });

});
