# Restful Booker Postman Collection

This folder contains the exported Postman collection for Part 3 of the QA assessment.

## Import

1. Open Postman.
2. Select **Import**.
3. Import `Restful-Booker-API.postman_collection.json`.
4. Run the requests in the **Positive booking lifecycle** folder in order (1 through 5).
5. Run the requests in **Negative scenarios** independently.

## Collection variables

- `baseUrl`: `https://restful-booker.herokuapp.com`
- `username`: `admin`
- `password`: `password123`
- `token`: populated by the Authenticate request
- `bookingId`: populated by Create booking and cleared by Delete booking

The positive flow creates a new booking, updates and verifies it, then deletes it. The collection includes response assertions for each request and negative tests for invalid credentials, empty booking payload, missing-token update/delete, and an unknown booking ID.
