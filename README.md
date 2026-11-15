# Junior Tech Associate (QA) Technical Assessment

This repository contains the automated deliverables for Parts 2 and 3.

- part-2/ — Coffee Cart UI automation with Playwright, TypeScript, Page Objects, fixtures, and isolated test data.
- part-3/ — Restful Booker API tests using Playwright APIRequestContext.
- postman/ — Importable Postman collection and environment template for the chained API workflow.

## Requirements
Node.js 20+, npm, and Playwright.

## Install
```bash
npm ci
npx playwright install --with-deps chromium
```

## Run
```bash
npm run test:ui
npm run test:api
npm test
```

The API suite uses the public demo credentials admin/password123 by default. Override with RESTFUL_BOOKER_USERNAME and RESTFUL_BOOKER_PASSWORD if needed.

## Postman
Import postman/Restful-Booker-API-Assessment.postman_collection.json and postman/Restful-Booker-Local.postman_environment.json. Select the environment and run the collection in order. The positive flow creates, updates, verifies, and deletes its booking. Negative scenarios cover all five endpoints.

## Engineering notes
- A fresh Playwright browser context is used per UI test.
- Test data is generated independently from test logic.
- No fixed sleeps or arbitrary wait times are used.
- API-created bookings are cleaned up in a finally block.
- The assessment's deliverables section requests a separate public repository for the exported Postman collection. This combined repository keeps it in postman/ as requested for this project; if strict separation is required, copy that folder to a second public repository.
