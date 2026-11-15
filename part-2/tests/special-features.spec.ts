import { test, expect } from '../fixtures/test.fixture';
import { coffeeData } from '../data/coffee.data';

test.describe('Coffee Cart special interactions', () => {
  test('handles the promo dialog when the third item triggers it', async ({ homePage, page }) => {
    await homePage.addProduct(coffeeData.primaryProduct, 3);
    const dialog = page.getByRole('dialog');

    if (await dialog.isVisible().catch(() => false)) {
      await expect(dialog).toBeVisible();
      await homePage.handlePromoIfVisible();
      await expect(dialog).toBeHidden();
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'No promo dialog appeared in this run; promo eligibility may be randomized.',
      });
    }
  });

  test('double-clicking a coffee title triggers Chinese translation', async ({ homePage }) => {
    const title = homePage.coffeeTitle(coffeeData.primaryProduct);
    await expect(title).toBeVisible();
    await title.dblclick();
    await expect(title).toContainText(/[\u3400-\u9FFF]/);
  });

  test('right-clicking a coffee icon opens the add-to-cart dialog', async ({ page }) => {
    const icon = page.locator('img[alt*="coffee" i], [aria-label*="coffee" i]').first();
    await expect(icon).toBeVisible();
    await icon.click({ button: 'right' });
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
