import { test, expect } from '../fixtures/test.fixture';
import { coffeeData, createCustomer } from '../data/coffee.data';

test.describe('Coffee Cart checkout', () => {
  test('customer can add a product and complete checkout', async ({ homePage, cartPage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct);

    // Coffee Cart checkout is a payment modal on the home page, not a
    // separate /cart route. Confirm the product in the cart preview first.
    const cartItem = page.locator('.cart-preview > li.list-item')
      .filter({ hasText: coffeeData.primaryProduct });
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem).toBeVisible();

    await cartPage.proceedToCheckout();
    await cartPage.submitPaymentDetails(createCustomer());
    await expect(page.getByText(/thanks for your purchase/i)).toBeVisible();
  });
});
