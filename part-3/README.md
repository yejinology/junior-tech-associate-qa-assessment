# Part 3 — Restful Booker API Testing

The Playwright API suite executes the required stateful chain:

1. POST /auth — obtain a token.
2. POST /booking — create a booking and extract bookingid.
3. PUT /booking/:id — update the same booking with the token cookie.
4. GET /booking/:id — verify the changed values persisted.
5. DELETE /booking/:id — clean up the created record.

Negative tests cover invalid authentication, an invalid empty create payload, update without a token, retrieval of an unknown ID, and delete without a token.

Run from the repository root: `npm run test:api`.

The positive test creates a unique booking and cleans it up in a finally block. The API is a shared public demo service, so the test does not depend on a fixed ID for the positive workflow.
