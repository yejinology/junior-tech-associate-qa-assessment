import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CartPage } from '../pages/cart.page';

type AssessmentFixtures = {
  homePage: HomePage;
  cartPage: CartPage;
};

export const test = base.extend<AssessmentFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect };
