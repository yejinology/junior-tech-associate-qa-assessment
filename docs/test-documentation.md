# Automated Test Documentation — Parts 2 and 3

## Scope and approach

This document records the automated coverage implemented in this repository. The target environments are the Coffee Cart web application (https://coffee-cart.app/) and Restful Booker API (https://restful-booker.herokuapp.com/apidoc/index.html).

The UI suite uses Playwright with TypeScript, Page Object Model, fixtures, generated customer data, role/label-based locators where available, browser-context isolation, and Playwright auto-waiting. The API suite uses Playwright APIRequestContext and dynamically passes the auth token and booking ID through the lifecycle.

## Part 2 — Coffee Cart UI test cases

| ID | Scenario | Steps | Expected result |
|---|---|---|---|
| UI-01 | Complete checkout | Open app; add Espresso; open cart; proceed to checkout; enter generated customer name/email; submit | Order confirmation/success message is visible |
| UI-02 | Promo popup handling | Add three products; inspect for promo dialog; dismiss if shown | If promo dialog appears, it can be dismissed and is no longer visible |
| UI-03 | Translate coffee title | Double-click Espresso title | Title displays Chinese characters |
| UI-04 | Context-menu add-to-cart | Right-click a coffee icon | Add-to-cart dialog opens |

### UI architecture notes

- Page objects: `HomePage` and `CartPage`.
- Fixtures: `homePage` navigates to the target before each test; `cartPage` supplies the cart abstraction.
- Test data: product names and generated customer details live in `part-2/data/coffee.data.ts`.
- Isolation: Playwright creates a new browser context for each test by default.
- Waiting: assertions and locator actions rely on Playwright's auto-waiting; no fixed sleeps are used.
- CI: GitHub Actions runs UI and API suites as separate jobs and uploads Playwright reports/artifacts.

## Part 3 — Restful Booker API test cases

### Positive chained workflow

| ID | Method and endpoint | Request details | Expected response / assertions |
|---|---|---|---|
| API-01 | POST /auth | JSON username/password | HTTP 200; response contains a non-empty token |
| API-02 | POST /booking | JSON booking payload with name, price, deposit flag, dates, and needs | HTTP 200; bookingid is numeric; booking object fields have expected types |
| API-03 | PUT /booking/:id | Updated booking payload; Cookie header contains token from API-01; ID from API-02 | HTTP 200; response contains updated booking data |
| API-04 | GET /booking/:id | ID extracted from API-02 | HTTP 200; updated first name and additional needs match the update |
| API-05 | DELETE /booking/:id | ID from API-02; Cookie header contains auth token | HTTP 201; test cleanup removes the created record |

### Negative scenarios

| ID | Endpoint | Invalid condition | Expected response / analysis |
|---|---|---|---|
| API-N01 | POST /auth | Invalid username and password | Demo API returns an auth failure reason and no token |
| API-N02 | POST /booking | Empty JSON object | Request must not be accepted as a successful booking creation |
| API-N03 | PUT /booking/:id | Missing authentication cookie | HTTP 403; update is rejected |
| API-N04 | GET /booking/:id | Non-existent booking ID | HTTP 404; no booking is returned |
| API-N05 | DELETE /booking/:id | Missing authentication cookie | HTTP 403; deletion is rejected |

### API data and cleanup

The positive flow creates a unique booking at runtime, stores the returned booking ID, authenticates, performs the update, retrieves the same booking, and deletes it in a `finally` cleanup path. The test validates response status codes, expected JSON field types, and the specific values changed by the update.

## Execution evidence

No execution screenshots or test logs are included yet. The repository contains the test code and CI workflow, but a run against the live public demo sites is required to produce genuine execution evidence. Do not treat the presence of test files as proof that the tests have passed.

## Known limitations / items to verify on first run

- Coffee Cart is a live application. Accessible labels and the exact checkout confirmation copy may change; confirm the locators against the current UI when running the suite.
- The promo popup is described as random. UI-02 treats the popup as conditional and records a note if it does not appear during that run.
- The public Restful Booker demo service is shared and may be rate-limited or temporarily unavailable.
- The Postman collection and Playwright API suite are both provided; the collection is intended to be run sequentially in Postman with the included environment selected.
