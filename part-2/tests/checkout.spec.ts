import { test, expect } from '../fixtures/test.fixture';
import { coffeeData, createCustomer } from '../data/coffee.data';

test.describe('Coffee Cart checkout', () => {
  test('customer can add a product and complete checkout', async ({ homePage, cartPage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct);
    await homePage.openCart();

    const cartItem = page.locator('.list-item')
      .filter({ hasText: coffeeData.primaryProduct });
    await expect(cartItem).toBeVisible();

    await cartPage.proceedToCheckout();
    await cartPage.submitPaymentDetails(createCustomer());
    await cartPage.expectSuccessfulOrder();
  });
});
