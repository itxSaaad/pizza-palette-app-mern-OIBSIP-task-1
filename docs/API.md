# API Reference

Complete API documentation for Pizza Palette backend endpoints.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Responses](#error-responses)
- [User Endpoints](#user-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Pizza Endpoints](#pizza-endpoints)
- [Order Endpoints](#order-endpoints)
- [Inventory Endpoints](#inventory-endpoints)
- [Analytics Endpoints](#analytics-endpoints)

---

## Base URL

**Development:**
```
http://localhost:5000/api
```

**Production:**
```
https://your-backend.vercel.app/api
```

---

## Authentication

### JWT Token

Most endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

### Token Generation

Tokens are returned on successful login/registration:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Token Expiry

- User tokens: 30 days
- Admin tokens: 30 days

---

## Error Responses

All errors follow a standardized format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "fieldName",
        "message": "Field-specific error",
        "value": "invalidValue"
      }
    ],
    "timestamp": "2026-02-22T10:30:00.000Z",
    "path": "/api/endpoint",
    "requestId": "req_unique_id"
  }
}
```

### Common Error Codes

These match `server/constants/errorCodes.js` exactly — the values shown are what actually appears in the response `code` field.

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_ERROR` | 401 | Missing/invalid JWT token |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `TOKEN_INVALID` | 401 | JWT is malformed/invalid |
| `EMAIL_NOT_VERIFIED` | 401 | Account email not yet verified |
| `FORBIDDEN` | 403 | Insufficient role/permissions |
| `ACCOUNT_NOT_APPROVED` | 403 | Admin/manager account pending approval |
| `NOT_FOUND` | 404 | Generic resource not found |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `RESOURCE_EXISTS` | 409 | Resource already exists |
| `VALIDATION_ERROR` | 400 | Request body failed validation |
| `LOW_STOCK` | 400 | Insufficient inventory for the order |
| `PAYMENT_ERROR` | 402 | Stripe payment/checkout failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

See [Error Handling Guide](./ERROR_HANDLING.md) for complete reference.

---

## User Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /users/register`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
```

**Validation:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `phoneNumber`: Required, 10-15 digits
- `address`: Required, minimum 5 characters

**Success Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "isVerified": false,
    "orders": [],
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- 400: Validation error
- 409: Email already exists

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /users/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- 401: Invalid credentials
- 400: Validation error

---

### Get User Profile

Get authenticated user's profile.

**Endpoint:** `GET /users/profile`

**Auth Required:** Yes (User)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "isVerified": true,
    "orders": ["order_id_1", "order_id_2"]
  }
}
```

---

### Update User Profile

Update authenticated user's profile.

**Endpoint:** `PUT /users/profile`

**Auth Required:** Yes (User)

**Request Body:**
```json
{
  "name": "John Updated",
  "phoneNumber": "9876543210",
  "address": "456 New St"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "address": "456 New St"
  },
  "message": "Profile updated successfully"
}
```

---

### Verify Email

Verify user email with verification code.

**Endpoint:** `PUT /users/verify`

**Auth Required:** Yes (User)

**Request Body:**
```json
{
  "verificationCode": "123456"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Forgot Password

Request password reset.

**Endpoint:** `POST /users/forgot-password`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password

Reset password with reset token.

**Endpoint:** `PUT /users/reset-password/:resetToken`

**Auth Required:** No

**Request Body:**
```json
{
  "password": "NewPassword@123"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Admin Endpoints

### Register Admin

Create a new admin account (requires approval).

**Endpoint:** `POST /admin/users/register`

**Auth Required:** No

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@pizzapalette.com",
  "password": "Admin@123456",
  "role": "manager"
}
```

**Validation:**
- `role`: Optional, must be "admin" or "manager", defaults to "manager"

**Success Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@pizzapalette.com",
    "role": "manager",
    "isApproved": false,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Admin registered. Awaiting approval."
}
```

---

### Login Admin

Authenticate admin user.

**Endpoint:** `POST /admin/users/login`

**Auth Required:** No

**Request Body:**
```json
{
  "email": "admin1@pizzapalette.com",
  "password": "Admin@123456"
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin1@pizzapalette.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- 403: Admin not approved
- 401: Invalid credentials

---

### Get All Admins

List all admin accounts (Admin only).

**Endpoint:** `GET /admin/users`

**Auth Required:** Yes (Admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin1@pizzapalette.com",
      "role": "admin",
      "isApproved": true
    }
  ]
}
```

---

### Approve Admin

Approve pending admin account (Admin only).

**Endpoint:** `PUT /admin/users/:id/approve`

**Auth Required:** Yes (Admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "isApproved": true
  },
  "message": "Admin approved successfully"
}
```

---

### Get All Users (Admin)

List all user accounts (Admin only).

**Endpoint:** `GET /admin/users/all-users`

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `isVerified`: Filter by verification status (true/false)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "users": [...],
    "page": 1,
    "pages": 5,
    "total": 50
  }
}
```

---

## Pizza Endpoints

### List All Pizzas

Get all available pizzas.

**Endpoint:** `GET /pizzas`

**Auth Required:** No

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `size`: Filter by size (small, medium, large, extra-large)
- `createdBy`: Filter by creator (user, admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "pizzas": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Margherita",
        "description": "Classic pizza",
        "bases": [{...}],
        "sauces": [{...}],
        "cheeses": [{...}],
        "veggies": [],
        "price": 12.99,
        "size": "medium",
        "createdBy": "admin",
        "imageUrl": "https://..."
      }
    ],
    "page": 1,
    "pages": 3,
    "total": 25
  }
}
```

---

### Get Pizza by ID

Get single pizza details.

**Endpoint:** `GET /pizzas/:id`

**Auth Required:** No

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Margherita",
    "description": "Classic pizza",
    "bases": [...],
    "sauces": [...],
    "cheeses": [...],
    "veggies": [],
    "price": 12.99,
    "size": "medium",
    "createdBy": "admin",
    "imageUrl": "https://..."
  }
}
```

**Error Responses:**
- 404: Pizza not found

---

### Create Pizza

Create a new pizza.

**Endpoint:** `POST /pizzas`

**Auth Required:** Yes (User or Admin)

**Request Body:**
```json
{
  "name": "Custom Veggie",
  "description": "My custom pizza",
  "bases": ["base_id_1"],
  "sauces": ["sauce_id_1"],
  "cheeses": ["cheese_id_1"],
  "veggies": ["veggie_id_1", "veggie_id_2"],
  "price": 15.99,
  "size": "large",
  "imageUrl": "https://..."
}
```

**Validation:**
- `name`: Required, 3-50 characters
- `description`: Required, minimum 10 characters
- `bases`: Required, array of valid ObjectIds
- `sauces`: Required, array of valid ObjectIds
- `cheeses`: Required, array of valid ObjectIds
- `veggies`: Optional, array of valid ObjectIds
- `price`: Required, positive number
- `size`: Required, must be one of: small, medium, large, extra-large
- `imageUrl`: Optional, valid URL

**Success Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Custom Veggie",
    ...
  },
  "message": "Pizza created successfully"
}
```

---

### Update Pizza (Admin Only)

Update existing pizza.

**Endpoint:** `PUT /pizzas/:id`

**Auth Required:** Yes (Admin)

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Name",
  "price": 16.99
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Name",
    "price": 16.99,
    ...
  },
  "message": "Pizza updated successfully"
}
```

---

### Delete Pizza (Admin Only)

Delete a pizza.

**Endpoint:** `DELETE /pizzas/:id`

**Auth Required:** Yes (Admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "message": "Pizza deleted successfully"
}
```

---

## Order Endpoints

### Create Stripe Checkout Session

Create a Stripe Checkout session for the cart and redirect to Stripe's hosted checkout page. Pricing (item prices, sales tax, delivery charges) is recomputed server-side from the database — client-supplied prices/totals are never trusted. Inventory is checked and deducted before the session is created, and rolled back if session creation fails.

**Endpoint:** `POST /orders/create-checkout-session`

**Auth Required:** Yes (User)

**Request Body:**
```json
{
  "orderItems": [
    { "_id": "pizza_id_1", "qty": 2, "size": "medium", "name": "Margherita", "imageUrl": "..." }
  ],
  "deliveryAddress": {
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  }
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_xxxxxxxxxxxxx",
    "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxxxxxxxxxx",
    "orderId": "order_id"
  },
  "message": "Stripe checkout session created successfully"
}
```

The client redirects the browser to `data.url`. Stripe redirects back to `${FRONTEND_URL}/checkout/success` or `/checkout/cancel` after payment; the order's actual payment status is confirmed separately via the webhook below, not by the redirect itself.

---

### Create Order (Cash on Delivery)

Create an order directly, without going through Stripe — used for the COD payment method.

**Endpoint:** `POST /orders`

**Auth Required:** Yes (User)

**Request Body:**
```json
{
  "orderItems": [
    { "_id": "pizza_id_1", "qty": 2, "size": "medium", "name": "Margherita" }
  ],
  "deliveryAddress": {
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "payment": {
    "method": "cod"
  }
}
```

Note: `salesTax`/`deliveryCharges`/`totalPrice`/item `price` are all recomputed server-side (`pricingUtils.calculateOrderPricing`) regardless of what's sent — they don't need to be (and won't be trusted if) included in the request.

**Success Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": "user_id",
    "orderItems": [...],
    "deliveryAddress": {...},
    "salesTax": 2.50,
    "deliveryCharges": 5.00,
    "totalPrice": 35.48,
    "payment": {...},
    "status": "Received",
    "createdAt": "2026-02-22T..."
  },
  "message": "Order created successfully"
}
```

**Error Responses:**
- 400: Payment verification failed
- 400: Insufficient inventory

---

### Get My Orders

Get authenticated user's orders.

**Endpoint:** `GET /orders/myorders`

**Auth Required:** Yes (User)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "orderItems": [...],
      "totalPrice": 35.48,
      "status": "Delivered",
      "createdAt": "2026-02-22T...",
      "deliveredAt": "2026-02-23T..."
    }
  ]
}
```

---

### Get Order by ID

Get specific order details.

**Endpoint:** `GET /orders/:id`

**Auth Required:** Yes (User - own orders, Admin - all orders)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "user": {...},
    "orderItems": [...],
    "deliveryAddress": {...},
    "payment": {...},
    "status": "In the Kitchen",
    "totalPrice": 35.48,
    "createdAt": "2026-02-22T..."
  }
}
```

---

### Get All Orders (Admin Only)

Get all orders with filters.

**Endpoint:** `GET /orders`

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `status`: Filter by status (Received, In the Kitchen, etc.)
- `user`: Filter by user ID

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "page": 1,
    "pages": 10,
    "total": 100
  }
}
```

---

### Update Order Status (Admin Only)

Update order status.

**Endpoint:** `PUT /orders/:id/status`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "status": "In the Kitchen"
}
```

**Validation:**
- `status`: Must be one of: Received, In the Kitchen, Sent for Delivery, Delivered, Cancelled

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "In the Kitchen",
    ...
  },
  "message": "Order status updated"
}
```

---

### Stripe Webhook

Handles Stripe payment events: `checkout.session.completed` (marks the order paid, sends the confirmation email — idempotent against Stripe's at-least-once delivery retries) and `payment_intent.payment_failed` (marks the order payment failed).

**Endpoint:** `POST /api/orders/stripe-webhook`

Note this is the one route in the API *not* prefixed under `/api/orders` relative to the documented base URL the way other order endpoints are — it's registered directly on the Express app in `server/index.js`, ahead of the global JSON body parsers, because Stripe's signature verification requires the raw, unparsed request body.

**Auth Required:** No (Stripe signature verification instead — see below)

**Headers:**
```
stripe-signature: <signature>
```

Verified server-side via `stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)`. A missing/invalid signature gets a `400` before any event is processed.

**Request Body:** raw Stripe event payload, e.g.:
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_xxxxxxxxxxxxx",
      "payment_intent": "pi_xxxxxxxxxxxxx",
      "metadata": { "orderId": "...", "userId": "..." }
    }
  }
}
```

**Success Response:** (200 OK)
```json
{
  "received": true
}
```

---

## Inventory Endpoints

### List All Inventory

Get all inventory items.

**Endpoint:** `GET /inventory`

**Auth Required:** No

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "bases": [...],
    "sauces": [...],
    "cheeses": [...],
    "veggies": [...]
  }
}
```

---

### Create Stock Item (Admin Only)

Add new inventory item.

**Endpoint:** `POST /inventory`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "type": "Base",
  "item": "Thin Crust",
  "price": 3.99,
  "quantity": 100,
  "threshold": 20
}
```

**Validation:**
- `type`: Required, must be one of: Base, Sauce, Cheese, Veggie
- `item`: Required, 2-50 characters
- `price`: Required, positive number
- `quantity`: Required, non-negative number
- `threshold`: Required, positive number

**Success Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "stock_id",
    "item": "Thin Crust",
    "price": 3.99,
    "quantity": 100,
    "threshold": 20
  },
  "message": "Stock item created"
}
```

---

### Update Stock Item (Admin Only)

Update inventory item.

**Endpoint:** `PUT /inventory/:id`

**Auth Required:** Yes (Admin)

**Request Body:** (All fields optional)
```json
{
  "quantity": 150,
  "price": 4.49
}
```

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "stock_id",
    "quantity": 150,
    "price": 4.49,
    ...
  },
  "message": "Stock updated"
}
```

---

### Delete Stock Item (Admin Only)

Delete inventory item.

**Endpoint:** `DELETE /inventory/:id`

**Auth Required:** Yes (Admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "message": "Stock item deleted"
}
```

---

## Analytics Endpoints

### Get Dashboard Stats (Admin Only)

Get dashboard statistics.

**Endpoint:** `GET /analytics/dashboard-stats`

**Auth Required:** Yes (Admin)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalOrders": 500,
    "totalRevenue": 12500.50,
    "ordersByStatus": {
      "Received": 10,
      "In the Kitchen": 5,
      "Sent for Delivery": 3,
      "Delivered": 480,
      "Cancelled": 2
    }
  }
}
```

---

### Get Revenue Analytics (Admin Only)

Get revenue data over time.

**Endpoint:** `GET /analytics/revenue`

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)
- `groupBy`: Group by (day, week, month)

**Success Response:** (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-01",
      "revenue": 1250.50,
      "orders": 50
    },
    ...
  ]
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Global:** 100 requests per 15 minutes
- **Login/Register:** 5 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614556800
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    ...
  }
}
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "page": 1,
    "pages": 10,
    "total": 100,
    "limit": 10
  }
}
```

---

## Related Documentation

- [Error Handling Guide](./ERROR_HANDLING.md) - Error codes and handling
- [Testing Guide](./TESTING.md) - API testing examples
- [Setup Guide](./SETUP.md) - API setup and configuration

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0
