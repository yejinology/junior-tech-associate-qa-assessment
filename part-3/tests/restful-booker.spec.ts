import { test, expect } from '@playwright/test';

const baseURL = 'https://restful-booker.herokuapp.com';
const username = process.env.RESTFUL_BOOKER_USERNAME || 'admin';
const password = process.env.RESTFUL_BOOKER_PASSWORD || 'password123';

type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

const newBooking = (): Booking => ({
  firstname: 'QA',
  lastname: `Assessment-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  totalprice: 275,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-15' },
  additionalneeds: 'Breakfast',
});

function assertBookingShape(body: any) {
  expect(body).toEqual(expect.objectContaining({
    firstname: expect.any(String),
    lastname: expect.any(String),
    totalprice: expect.any(Number),
    depositpaid: expect.any(Boolean),
    bookingdates: expect.objectContaining({
      checkin: expect.any(String),
      checkout: expect.any(String),
    }),
    additionalneeds: expect.any(String),
  }));
}

test.describe('Restful Booker API', () => {
  test('authenticates, creates, updates, verifies, and deletes a booking', async ({ request }) => {
    let bookingId: number | undefined;
    let token: string | undefined;

    try {
      const auth = await request.post(`${baseURL}/auth`, {
        data: { username, password },
      });
      expect(auth.status()).toBe(200);
      const authBody = await auth.json();
      expect(authBody.token).toEqual(expect.any(String));
      token = authBody.token;

      const original = newBooking();
      const createdResponse = await request.post(`${baseURL}/booking`, {
        data: original,
        headers: { Accept: 'application/json' },
      });
      expect(createdResponse.status()).toBe(200);
      const created = await createdResponse.json();
      expect(created.bookingid).toEqual(expect.any(Number));
      bookingId = created.bookingid;
      assertBookingShape(created.booking);

      const changed = { ...original, firstname: 'UpdatedQA', additionalneeds: 'Vegetarian breakfast' };
      const update = await request.put(`${baseURL}/booking/${bookingId}`, {
        data: changed,
        headers: { Accept: 'application/json', Cookie: `token=${token}` },
      });
      expect(update.status()).toBe(200);
      assertBookingShape(await update.json());

      const verify = await request.get(`${baseURL}/booking/${bookingId}`, {
        headers: { Accept: 'application/json' },
      });
      expect(verify.status()).toBe(200);
      const persisted = await verify.json();
      assertBookingShape(persisted);
      expect(persisted.firstname).toBe(changed.firstname);
      expect(persisted.additionalneeds).toBe(changed.additionalneeds);
    } finally {
      if (bookingId !== undefined) {
        if (!token) {
          const auth = await request.post(`${baseURL}/auth`, { data: { username, password } });
          if (auth.ok()) token = (await auth.json()).token;
        }
        if (token) {
          const cleanup = await request.delete(`${baseURL}/booking/${bookingId}`, {
            headers: { Cookie: `token=${token}` },
          });
          expect([201, 404]).toContain(cleanup.status());
        }
      }
    }
    expect(bookingId).toEqual(expect.any(Number));
  });

  test('negative: invalid credentials do not return a token', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth`, {
      data: { username: 'invalid-user', password: 'invalid-password' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('reason');
    expect(body).not.toHaveProperty('token');
  });

  test('negative: empty booking payload is rejected', async ({ request }) => {
    const response = await request.post(`${baseURL}/booking`, { data: {} });
    expect(response.status()).not.toBe(200);
  });

  test('negative: update without a token is forbidden', async ({ request }) => {
    const response = await request.put(`${baseURL}/booking/1`, {
      data: newBooking(),
      headers: { Accept: 'application/json' },
    });
    expect(response.status()).toBe(403);
  });

  test('negative: unknown booking ID returns not found', async ({ request }) => {
    const response = await request.get(`${baseURL}/booking/999999999`);
    expect(response.status()).toBe(404);
  });

  test('negative: delete without a token is forbidden', async ({ request }) => {
    const response = await request.delete(`${baseURL}/booking/1`);
    expect(response.status()).toBe(403);
  });
});
