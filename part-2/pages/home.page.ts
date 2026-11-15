import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/coffee-cart\.app/);
    await expect(this.coffeeTitle('Espresso')).toBeVisible();
  }

  // Each coffee is rendered as an li containing its own .cup-body.
  // Anchor the heading to that product card to avoid hidden preview text
  // and similarly named products such as Espresso Macchiato.
  coffeeTitle(productName: string): Locator {
    const productCard = this.page.locator('li').filter({
      has: this.page.locator(`.cup-body[aria-label="${productName}"]`),
    });
    return productCard.locator('h4');
  }

  coffeeIcon(productName: string): Locator {
    return this.page.locator(`.cup-body[aria-label="${productName}"]`);
  }

  async addProduct(productName: string, quantity = 1) {
    const cup = this.coffeeIcon(productName);
    await expect(cup).toBeVisible();

    for (let index = 0; index < quantity; index += 1) {
      await cup.click();
      await this.handlePromoIfVisible();
    }
  }

  async handlePromoIfVisible() {
    const promo = this.page.locator('.promo');
    if (!(await promo.isVisible().catch(() => false))) return;

    const skip = promo.getByRole('button', { name: /nah, i'll skip/i });
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(promo).toBeHidden();
  }

  async openCart() {
    const control = this.page.getByRole('link', { name: /cart/i });
    await expect(control).toBeVisible();
    await control.click();
    await expect(this.page).toHaveURL(/\/cart/);
  }
}
