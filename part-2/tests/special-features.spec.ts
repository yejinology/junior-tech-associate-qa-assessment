import { test, expect } from '../fixtures/test.fixture';
import { coffeeData } from '../data/coffee.data';

test.describe('Coffee Cart special interactions', () => {
  test('handles the promo dialog when the third item triggers it', async ({ homePage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct, 3);
    await expect(page.locator('.promo')).toBeHidden();
    await expect(homePage.coffeeTitle(coffeeData.primaryProduct)).toBeVisible();
  });

  test('double-clicking a coffee title triggers Chinese translation', async ({ homePage }) => {
    const title = homePage.coffeeTitle(coffeeData.primaryProduct);
    await expect(title).toBeVisible();
    await title.dblclick();
    await expect(title).toContainText(/[\u3400-\u9FFF]/);
  });

  test('right-clicking a coffee icon opens the add-to-cart dialog', async ({ homePage, page }) => {
    const icon = homePage.coffeeIcon(coffeeData.primaryProduct);
    await expect(icon).toBeVisible();
    await icon.click({ button: 'right' });
    const dialog = page.locator('dialog[data-cy="add-to-cart-modal"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(coffeeData.primaryProduct);
    await dialog.getByRole('button', { name: 'No' }).click();
    await expect(dialog).toBeHidden();
  });
});
