import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async proceedToCheckout() {
    const button = this.page.getByRole('button', {
      name: /proceed to checkout|checkout/i,
    }).first();
    await expect(button).toBeVisible();
    await button.click();
  }

  async submitPaymentDetails(customer: { name: string; email: string }) {
    const name = this.page.getByLabel(/name/i).or(this.page.getByPlaceholder(/name/i)).first();
    const email = this.page.getByLabel(/email/i).or(this.page.getByPlaceholder(/email/i)).first();

    await expect(name).toBeVisible();
    await name.fill(customer.name);
    await email.fill(customer.email);

    const submit = this.page.getByRole('button', {
      name: /submit|pay|place order|complete order/i,
    }).first();
    await expect(submit).toBeEnabled();
    await submit.click();
  }

  async expectSuccessfulOrder() {
    await expect(this.page.getByText(
      /thank you|order.*success|payment.*success|successfully/i,
    ).first()).toBeVisible();
  }
}
