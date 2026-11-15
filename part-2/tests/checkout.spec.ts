import { test, expect } from '../fixtures/test.fixture';
import { coffeeData, createCustomer } from '../data/coffee.data';

test.describe('Coffee Cart checkout', () => {
  test('customer can add a product and complete checkout', async ({ homePage, cartPage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct);

    // The cart preview is hidden until checkout is hovered. Verify the
    // product row exists without incorrectly requiring it to be visible.
    const cartItem = page.locator('.cart-preview > li.list-item')
      .filter({ hasText: coffeeData.primaryProduct });
    await expect(cartItem).toHaveCount(1);

    await cartPage.proceedToCheckout();
    await cartPage.submitPaymentDetails(createCustomer());
    await expect(page.getByText(/thanks for your purchase/i)).toBeVisible();
  });
});
