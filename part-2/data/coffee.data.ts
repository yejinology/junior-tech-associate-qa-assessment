export const coffeeData = {
  primaryProduct: 'Espresso',
  bonusProduct: 'Americano',
};

export function createCustomer() {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
  return {
    name: 'QA Assessment Customer',
    email: `qa-assessment-${unique}@example.com`,
  };
}
