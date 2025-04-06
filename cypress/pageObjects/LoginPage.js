class LoginPage {
    elements = {
      usernameInput: () => cy.get('#user-name'),
      passwordInput: () => cy.get('#password'),
      loginButton: () => cy.get('#login-button'),
      errorMessage: () => cy.get('[data-test="error"]')
    };
  
    login(username, password) {
      this.elements.usernameInput().type(username);
      this.elements.passwordInput().type(password);
      this.elements.loginButton().click();
    }
  }
  
  export default LoginPage;
  