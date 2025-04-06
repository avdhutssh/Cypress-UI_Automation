import LoginPage from './LoginPage';
import InventoryPage from './InventoryPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';

class PageManager {
  constructor() {
    this.loginPage = new LoginPage();
    this.inventoryPage = new InventoryPage();
    this.cartPage = new CartPage();
    this.checkoutPage = new CheckoutPage();
  }
}

export default new PageManager();
