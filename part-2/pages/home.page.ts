import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/coffee-cart\.app/);
  }

  private addButton(productName: string): Locator {
    return this.page.getByRole('button', {
      name: new RegExp(`add one ${productName}`, 'i'),
    });
  }

  async addProduct(productName: string, quantity = 1) {
    const button = this.addButton(productName);
    await expect(button).toBeVisible();
    for (let index = 0; index < quantity; index += 1) {
      await button.click();
      await this.handlePromoIfVisible();
    }
  }

  async handlePromoIfVisible() {
    const dialog = this.page.getByRole('dialog');
    if (!(await dialog.isVisible().catch(() => false))) return;

    const dismiss = dialog.getByRole('button', {
      name: /no thanks|not now|skip|close|continue/i,
    }).first();

    if (await dismiss.isVisible().catch(() => false)) {
      await dismiss.click();
      await expect(dialog).toBeHidden();
    } else {
      await this.page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  }

  async openCart() {
    const control = this.page.getByRole('button', { name: /cart/i })
      .or(this.page.getByRole('link', { name: /cart/i })).first();
    await expect(control).toBeVisible();
    await control.click();
  }

  coffeeTitle(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName, exact: true });
  }
}
