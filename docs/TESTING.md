# Testing Guide

Comprehensive guide for testing Pizza Palette application.

## Table of Contents

- [Test Credentials](#test-credentials)
- [Testing Strategy](#testing-strategy)
- [API Testing](#api-testing)
- [Frontend Testing](#frontend-testing)
- [Payment Testing](#payment-testing)
- [Test Scenarios](#test-scenarios)

---

## Test Credentials

### Admin Accounts

#### Super Admin
- **Email:** `admin1@pizzapalette.com`
- **Password:** `Admin@123456`
- **Role:** Admin
- **Permissions:** Full access

#### Manager
- **Email:** `admin2@pizzapalette.com`
- **Password:** `Manager@123456`
- **Role:** Manager
- **Permissions:** Limited admin access

### User Accounts

#### Verified User 1
- **Email:** `john@example.com`
- **Password:** `User@123456`
- **Status:** Verified
- **Has Orders:** Yes

#### Verified User 2
- **Email:** `jane@example.com`
- **Password:** `User@123456`
- **Status:** Verified
- **Has Orders:** Yes

#### Unverified User
- **Email:** `test@example.com`
- **Password:** `User@123456`
- **Status:** Not verified
- **Has Orders:** No

---

## Testing Strategy

### Manual Testing
- User flows (registration, login, ordering)
- UI/UX testing
- Payment integration
- Email notifications
- Admin dashboard functionality

### API Testing
- Postman/cURL for endpoint testing
- Authentication flows
- Error handling validation
- Data validation

### Browser Testing
- Chrome, Firefox, Safari
- Responsive design (mobile, tablet, desktop)
- Cross-browser compatibility

---

## API Testing

### Setup

```bash
# Base URL
export API_URL=http://localhost:5000/api

# Or for production
export API_URL=https://your-backend.vercel.app/api
```

### Authentication

#### Register New User

```bash
curl -X POST $API_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "newuser@example.com",
    "password": "Password@123",
    "phoneNumber": "1234567890",
    "address": "123 Test Street"
  }'
```

**Expected Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "newuser@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

#### Login User

```bash
curl -X POST $API_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "User@123456"
  }'
```

**Extract Token:**
```bash
export TOKEN=$(curl -X POST $API_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"User@123456"}' \
  | jq -r '.data.token')
```

#### Admin Login

```bash
curl -X POST $API_URL/admin/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin1@pizzapalette.com",
    "password": "Admin@123456"
  }'
```

### Pizza Endpoints

#### List All Pizzas

```bash
curl $API_URL/pizzas
```

#### Get Pizza by ID

```bash
curl $API_URL/pizzas/507f1f77bcf86cd799439011
```

#### Create Pizza (Admin Only)

```bash
curl -X POST $API_URL/pizzas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Veggie Supreme",
    "description": "Loaded with vegetables",
    "bases": ["base_id_1"],
    "sauces": ["sauce_id_1"],
    "cheeses": ["cheese_id_1"],
    "veggies": ["veggie_id_1", "veggie_id_2"],
    "price": 12.99,
    "size": "medium",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

#### Update Pizza (Admin Only)

```bash
curl -X PUT $API_URL/pizzas/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "price": 14.99
  }'
```

#### Delete Pizza (Admin Only)

```bash
curl -X DELETE $API_URL/pizzas/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Order Endpoints

#### Create Stripe Checkout Session

```bash
curl -X POST $API_URL/orders/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "orderItems": [
      { "_id": "pizza_id_1", "qty": 2, "size": "medium", "name": "Margherita" }
    ],
    "deliveryAddress": {
      "phoneNumber": "1234567890",
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    }
  }'
```

**Response:**
```javascript
{
  "success": true,
  "data": {
    "sessionId": "cs_test_xxxxx",
    "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxx",
    "orderId": "order_id"
  },
  "message": "Stripe checkout session created successfully"
}
```

Redirect the browser to `data.url` to complete payment on Stripe's hosted checkout page — see [Stripe Setup Guide](./STRIPE_SETUP.md) for the full local testing flow (test cards, `stripe listen`, triggering webhook events).

#### Create Order (Cash on Delivery)

```bash
curl -X POST $API_URL/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "orderItems": [
      {
        "_id": "pizza_id_1",
        "qty": 2,
        "size": "medium",
        "name": "Margherita"
      }
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
  }'
```

Pricing (`salesTax`/`deliveryCharges`/`totalPrice`/item `price`) is always recomputed server-side — no need to (and no point trying to) pass it in the request.

#### Get My Orders

```bash
curl $API_URL/orders/myorders \
  -H "Authorization: Bearer $USER_TOKEN"
```

#### Get Order by ID

```bash
curl $API_URL/orders/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $USER_TOKEN"
```

#### Get All Orders (Admin Only)

```bash
curl $API_URL/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### Update Order Status (Admin Only)

```bash
curl -X PUT $API_URL/orders/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "In the Kitchen"
  }'
```

### Inventory Endpoints

#### List All Inventory

```bash
curl $API_URL/inventory
```

#### Create Stock Item (Admin Only)

```bash
curl -X POST $API_URL/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "type": "Base",
    "item": "Thin Crust",
    "price": 3.99,
    "quantity": 100,
    "threshold": 20
  }'
```

### Error Testing

#### Invalid Credentials

```bash
curl -X POST $API_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401):**
```javascript
{
  "success": false,
  "error": {
    "code": "AUTH_1001",
    "message": "Invalid email or password",
    "timestamp": "2026-02-22T...",
    "path": "/api/users/login",
    "requestId": "req_..."
  }
}
```

#### Validation Error

```bash
curl -X POST $API_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email"
  }'
```

**Expected Response (400):**
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_3001",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Invalid email format", "value": "invalid-email" },
      { "field": "password", "message": "Password is required", "value": undefined }
    ],
    "timestamp": "2026-02-22T...",
    "path": "/api/users/register",
    "requestId": "req_..."
  }
}
```

#### Unauthorized Access

```bash
curl $API_URL/orders/myorders
```

**Expected Response (401):**
```javascript
{
  "success": false,
  "error": {
    "code": "AUTH_1004",
    "message": "Not authorized, no token provided",
    "timestamp": "2026-02-22T...",
    "path": "/api/orders/myorders",
    "requestId": "req_..."
  }
}
```

---

## Frontend Testing

### User Registration Flow

1. Navigate to `/register`
2. Fill in registration form:
   - Name: `Test User`
   - Email: `test123@example.com`
   - Password: `Test@123456`
   - Phone: `1234567890`
   - Address: `123 Test Street`
3. Submit form
4. Check for success message
5. Verify redirect to menu page
6. Verify token stored in localStorage

### User Login Flow

1. Navigate to `/login`
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `User@123456`
3. Submit form
4. Check for success message
5. Verify redirect to menu page
6. Verify user info displayed in navbar

### Custom Pizza Creation

1. Login as user
2. Navigate to `/create-custom-pizza`
3. Select pizza details:
   - Name: `My Custom Pizza`
   - Size: `medium`
   - Base: Select at least one
   - Sauce: Select at least one
   - Cheese: Select at least one
   - Veggies: Select at least one (optional)
4. Submit form
5. Pizza should be created and added to menu
6. Should show success message

### Add to Cart

1. Browse menu (`/`)
2. Click on a pizza
3. Select quantity
4. Click "Add to Cart"
5. Cart icon should update count
6. Navigate to `/cart`
7. Verify pizza is in cart with correct quantity and price

### Checkout Flow

1. Have items in cart
2. Navigate to `/cart`
3. Click "Proceed to Checkout"
4. Fill in delivery address
5. Choose Stripe as the payment method and click "Place Order"
6. Browser redirects to a Stripe-hosted checkout page
7. Complete payment (use a test card — see below)
8. Stripe redirects back to `/checkout/success` (or `/checkout/cancel`)
9. Order should appear in "My Orders" once the webhook confirms payment (near-instant locally with `stripe listen` running)

### Admin Dashboard

1. Login as admin:
   - Email: `admin1@pizzapalette.com`
   - Password: `Admin@123456`
2. Navigate to `/admin/dashboard`
3. Verify dashboard displays:
   - Total users count
   - Total orders count
   - Total revenue
   - Order status chart
   - Recent orders list
4. Test order status update
5. Test pizza creation
6. Test inventory management

---

## Payment Testing

### Stripe Test Mode

See the [Stripe Setup Guide](./STRIPE_SETUP.md) for installing the Stripe CLI and running `stripe listen` locally — required for webhook events (order confirmation) to reach your local server at all.

#### Test Card Numbers

**Success:**
- **Card:** `4242 4242 4242 4242`
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **ZIP:** Any 5 digits

**Failed Payment (generic decline):**
- **Card:** `4000 0000 0000 0002`

**Insufficient Funds:**
- **Card:** `4000 0000 0000 9995`

Full list of Stripe test cards: https://docs.stripe.com/testing#cards

### Payment Flow Testing

#### Test Successful Payment

1. Add items to cart
2. Proceed to checkout
3. Enter delivery address
4. Choose Stripe, click "Place Order"
5. Redirected to Stripe-hosted checkout
6. Enter test card: `4242 4242 4242 4242`
7. Any future expiry, any CVV, any ZIP
8. Click "Pay"
9. Payment should succeed, Stripe redirects to `/checkout/success`
10. Order created in database, marked paid via the webhook
11. Inventory deducted
12. Confirmation email sent to user

#### Test Failed Payment

1. Follow steps 1-4 above
2. On the Stripe-hosted page, enter test card: `4000 0000 0000 0002`
3. Click "Pay"
4. Payment should be declined by Stripe (stays on the Stripe page with an error, or redirects to `/checkout/cancel` depending on how you cancel out)
5. Order's payment status should reflect the failure once `payment_intent.payment_failed` is delivered
6. Inventory deducted for the order is **not** currently rolled back if you abandon checkout without either succeeding or Stripe sending a definitive failure event — see the inventory-rollback note in `docs/STRIPE_SETUP.md`/PR history if testing this edge case specifically

#### Test Webhook Signature Verification

1. Complete a successful payment with `stripe listen` running
2. Backend receives the webhook at `POST /api/orders/stripe-webhook`
3. `stripe.webhooks.constructEvent` verifies the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET`
4. Order status updates to paid; a duplicate delivery of the same event is a no-op (idempotency check on the order's existing payment status)
5. Check server logs for `Payment confirmed for order: ...` / `Duplicate webhook delivery ignored for order: ...`

---

## Test Scenarios

### User Flow Scenarios

#### Scenario 1: New User Registration and First Order

1. Register new account
2. Verify email (if email verification enabled)
3. Login
4. Browse pizzas
5. Add 2 pizzas to cart
6. Update quantities
7. Proceed to checkout
8. Enter delivery address
9. Complete payment
10. Check order confirmation
11. View order in "My Orders"

**Expected Result:** Order created successfully, email received, inventory deducted

#### Scenario 2: Existing User Reorder

1. Login as `john@example.com`
2. Go to "My Orders"
3. View past order details
4. Add same pizzas to cart
5. Checkout and complete payment

**Expected Result:** Can easily reorder previous items

#### Scenario 3: Custom Pizza Creation

1. Login as user
2. Create custom pizza with:
   - Unique combination of ingredients
   - Different sizes
3. Add to cart
4. Complete order

**Expected Result:** Custom pizza created, appears in menu, can be ordered

### Admin Flow Scenarios

#### Scenario 1: Order Management

1. Login as admin
2. View all orders in dashboard
3. Filter orders by status
4. Update order status from "Received" to "In the Kitchen"
5. Verify status update reflected
6. Check if email sent to customer

**Expected Result:** Order status updated, customer notified

#### Scenario 2: Inventory Management

1. Login as admin
2. View inventory
3. Create new stock item
4. Update existing stock quantity
5. Delete stock item
6. Check inventory alerts (low stock)

**Expected Result:** Inventory CRUD operations work correctly

#### Scenario 3: Pizza Management

1. Login as admin
2. Create new pizza
3. Edit pizza details
4. Delete pizza
5. Verify changes reflected on menu

**Expected Result:** Pizza CRUD operations work correctly

### Error Scenarios

#### Scenario 1: Out of Stock Handling

1. Admin sets ingredient quantity to 0
2. User tries to order pizza with that ingredient
3. Should show "Out of stock" error
4. Cannot complete order

**Expected Result:** Order prevented, user notified

#### Scenario 2: Invalid Payment

1. User reaches payment step
2. Enters invalid card
3. Payment fails
4. User sees error message
5. No order created

**Expected Result:** Payment fails gracefully, no data corruption

#### Scenario 3: Session Expiry

1. User logs in
2. Token expires (after 30 days)
3. User tries to access protected route
4. Should redirect to login
5. Show "Session expired" message

**Expected Result:** Graceful session expiry handling

---

## Running Automated Tests

### Backend Tests

```bash
# Run all backend tests
cd server
npm test

# Run specific test file
npm test -- utils/ApiError.test.js

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
# Run all frontend tests
cd client
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

---

## Test Coverage Goals

### Backend
- Controllers: 80%+
- Utils: 90%+
- Validators: 85%+
- Middleware: 85%+

### Frontend
- Components: 70%+
- Utils: 80%+
- Redux: 75%+

---

## Debugging Tips

### Enable Detailed Logging

```bash
# Backend
NODE_ENV=development npm run dev

# Check MongoDB queries
mongoose.set('debug', true);
```

### Browser DevTools

- **Network Tab:** Check API requests/responses
- **Console:** Check for JavaScript errors
- **Application → Local Storage:** Verify token storage
- **Redux DevTools:** Inspect state changes

### API Debugging

```bash
# Add verbose flag to curl
curl -v $API_URL/pizzas

# Pretty print JSON
curl $API_URL/pizzas | jq '.'

# Check response headers
curl -I $API_URL/pizzas
```

---

## Related Documentation

- [API Reference](./API.md) - API endpoints
- [Setup Guide](./SETUP.md) - Environment setup
- [Test Credentials](../TEST_CREDENTIALS.md) - All test accounts

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0
