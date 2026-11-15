import { test, expect } from '../fixtures/test.fixture';
import { coffeeData, createCustomer } from '../data/coffee.data';

test.describe('Coffee Cart checkout', () => {
  test('customer can add a product and complete checkout', async ({ homePage, cartPage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct);
    await homePage.openCart();

    // Scope to CartPage's .list container. The Pay component also renders
    // a preview row with .list-item, so a page-wide locator is ambiguous.
    const cartItem = page.locator('.list > ul > li.list-item')
      .filter({ hasText: coffeeData.primaryProduct });
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem).toBeVisible();

    await cartPage.proceedToCheckout();
    await cartPage.submitPaymentDetails(createCustomer());
    await cartPage.expectSuccessfulOrder();
  });
});
