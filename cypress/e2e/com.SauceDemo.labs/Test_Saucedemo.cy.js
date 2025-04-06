import pages from '../../pageObjects/PageManager';

describe('SauceDemo E2E Tests', () => {
  let testData;

  before(() => {
    cy.fixture('testdata').then((data) => {
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

  it.only('TC09 - Validate Error Messages for Checkout Information', () => {
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
