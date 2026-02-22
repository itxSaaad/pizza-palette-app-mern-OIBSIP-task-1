# System Architecture

Comprehensive overview of Pizza Palette's system architecture, design patterns, and data flows.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Payment Flow](#payment-flow)
- [Error Handling](#error-handling)
- [Constants Management](#constants-management)

---

## Overview

Pizza Palette is a full-stack MERN application following modern web development practices:
- **Separation of Concerns**: Frontend and backend are independent deployments
- **RESTful API**: Standard REST principles for API design
- **Stateless Authentication**: JWT-based auth with no server-side sessions
- **Standardized Error Handling**: Structured error responses with codes
- **Centralized Constants**: Single source of truth for enums and types

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite 4** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Nodemailer** - Email sending
- **Razorpay SDK** - Payment processing

### Security & Middleware
- **Helmet** - Security headers
- **express-mongo-sanitize** - NoSQL injection prevention
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM with schema validation
- **MongoDB Atlas** - Cloud hosting (production)

### Deployment
- **Vercel** - Frontend and backend (serverless functions)
- **GitHub** - Version control and CI/CD

---

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    User[User Browser]
    Frontend[React Frontend<br/>Vite + Tailwind]
    Backend[Express Backend<br/>Node.js API]
    Database[(MongoDB<br/>Atlas/Local)]
    Payment[Razorpay<br/>Payment Gateway]
    Email[Email Service<br/>Nodemailer]
    
    User -->|HTTPS| Frontend
    Frontend -->|REST API| Backend
    Backend -->|Mongoose ODM| Database
    Backend -->|Payment API| Payment
    Backend -->|SMTP| Email
    Payment -->|Webhook| Backend
    
    style Frontend fill:#61dafb
    style Backend fill:#68a063
    style Database fill:#47a248
    style Payment fill:#3395ff
```

### Component Architecture

```mermaid
graph TB
    subgraph Frontend[React Frontend]
        Pages[Pages/Screens]
        Components[Reusable Components]
        Redux[Redux Store]
        Thunks[Async Thunks]
        Constants[Constants]
        Utils[Utils]
        
        Pages --> Components
        Pages --> Redux
        Redux --> Thunks
        Thunks -->|API Calls| Backend
        Components --> Constants
        Components --> Utils
    end
    
    subgraph Backend[Express Backend]
        Routes[API Routes]
        Middleware[Middleware Layer]
        Controllers[Controllers]
        Validators[Validators]
        Schemas[Mongoose Models]
        BackConstants[Constants]
        BackUtils[Utils]
        
        Routes --> Middleware
        Middleware --> Validators
        Validators --> Controllers
        Controllers --> Schemas
        Controllers --> BackConstants
        Controllers --> BackUtils
        Schemas --> BackConstants
    end
    
    Frontend -->|HTTP/REST| Backend
    Backend -->|JSON Response| Frontend
```

---

## Folder Structure

### Backend Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── constants/                  # Centralized constants
│   ├── errorCodes.js
│   ├── orderStatus.js
│   ├── pizzaSizes.js
│   ├── inventoryTypes.js
│   ├── paymentConstants.js
│   ├── userRoles.js
│   └── index.js               # Exports all constants
├── controllers/                # Business logic
│   ├── userControllers.js
│   ├── adminUserControllers.js
│   ├── pizzaControllers.js
│   ├── orderControllers.js
│   ├── inventoryControllers.js
│   └── analyticsControllers.js
├── middlewares/                # Custom middleware
│   ├── authMiddlewares.js     # JWT authentication
│   ├── errorMiddlewares.js    # Error handling
│   ├── validationHandler.js   # Validation processing
│   ├── rateLimitMiddleware.js # Rate limiting
│   └── nodemailerMiddleware.js# Email sending
├── routes/                     # API routes
│   ├── userRoutes.js
│   ├── adminUserRoutes.js
│   ├── pizzaRoutes.js
│   ├── orderRoutes.js
│   ├── inventoryRoutes.js
│   └── analyticsRoutes.js
├── schemas/                    # Mongoose models
│   ├── userSchema.js
│   ├── adminUserSchema.js
│   ├── pizzaSchema.js
│   ├── orderSchema.js
│   └── inventorySchema.js
├── validators/                 # Input validation
│   ├── userValidators.js
│   ├── adminValidators.js
│   ├── pizzaValidators.js
│   ├── orderValidators.js
│   └── inventoryValidators.js
├── utils/                      # Utilities
│   ├── ApiError.js            # Custom error class
│   ├── ApiResponse.js         # Success response wrapper
│   ├── errorCodeMapper.js     # Error code mapping
│   ├── generateToken.js       # JWT generation
│   ├── paginationUtils.js     # Pagination helpers
│   ├── razorpayUtils.js       # Razorpay verification
│   ├── inventoryDeductionUtils.js
│   ├── inventoryAlertUtils.js
│   └── envValidator.js        # Env validation
├── data/                       # Seed data
│   ├── users.js
│   ├── pizzas.js
│   └── inventory.js
├── __tests__/                  # Tests
│   └── utils/
├── index.js                    # Entry point
└── package.json
```

### Frontend Structure

```
client/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── route/             # Route guards
│   │   └── ui/                # Reusable UI components
│   │       ├── Admin/         # Admin components
│   │       ├── Cart/          # Cart components
│   │       ├── CheckoutSteps/ # Checkout flow
│   │       └── ...
│   ├── constants/              # Frontend constants
│   │   ├── orderStatus.js
│   │   ├── pizzaSizes.js
│   │   ├── inventoryTypes.js
│   │   ├── paymentConstants.js
│   │   ├── userRoles.js
│   │   └── index.js
│   ├── redux/
│   │   ├── asyncThunks/       # API calls
│   │   │   ├── userThunks.js
│   │   │   ├── pizzaThunks.js
│   │   │   ├── orderThunks.js
│   │   │   ├── inventoryThunks.js
│   │   │   └── adminThunks.js
│   │   ├── slices/            # Redux slices
│   │   │   ├── userSlice.js
│   │   │   ├── pizzaSlice.js
│   │   │   ├── orderSlice.js
│   │   │   ├── inventorySlice.js
│   │   │   ├── adminSlice.js
│   │   │   └── cartSlice.js
│   │   └── store.js           # Redux store
│   ├── screens/               # Page components
│   │   ├── User/
│   │   ├── Admin/
│   │   └── ...
│   ├── utils/                 # Utilities
│   │   └── errorUtils.js     # Error extraction
│   ├── App.jsx
│   ├── main.jsx              # Entry point
│   └── index.css
├── .env                       # Environment variables
└── package.json
```

---

## Data Flow

### User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant E as Email Service
    
    U->>F: Fill registration form
    F->>B: POST /api/users/register
    B->>B: Validate input
    B->>DB: Check if user exists
    DB-->>B: User not found
    B->>B: Hash password
    B->>B: Generate verification code
    B->>DB: Create user
    DB-->>B: User created
    B->>E: Send verification email
    E-->>U: Email with code
    B-->>F: Success response + JWT
    F->>F: Store JWT in localStorage
    F-->>U: Redirect to menu
```

### Order Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant R as Razorpay
    participant E as Email Service
    
    U->>F: Add items to cart
    U->>F: Proceed to checkout
    F->>B: POST /api/orders/checkout
    B->>R: Create Razorpay order
    R-->>B: Order ID
    B-->>F: Razorpay order details
    F->>U: Show Razorpay modal
    U->>R: Complete payment
    R->>B: Webhook notification
    B->>DB: Verify payment signature
    B->>DB: Check inventory availability
    DB-->>B: Inventory available
    B->>DB: Deduct inventory
    B->>DB: Create order
    DB-->>B: Order created
    B->>E: Send confirmation email
    E-->>U: Order confirmation
    B-->>F: Success response
    F-->>U: Show order confirmation
```

---

## Database Schema

### Core Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  phoneNumber: String,
  address: String,
  isVerified: Boolean,
  verificationCode: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  orders: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Admins Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['admin', 'manager']),
  permissions: [String],
  isApproved: Boolean (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Pizzas Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  bases: [ObjectId] (ref: Base),
  sauces: [ObjectId] (ref: Sauce),
  cheeses: [ObjectId] (ref: Cheese),
  veggies: [ObjectId] (ref: Veggie),
  price: Number,
  size: String (enum: PIZZA_SIZE_VALUES),
  createdBy: String (enum: ['admin', 'user']),
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  orderItems: [{
    pizza: ObjectId (ref: Pizza),
    qty: Number,
    price: Number
  }],
  deliveryAddress: {
    phoneNumber: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  salesTax: Number,
  deliveryCharges: Number,
  totalPrice: Number,
  payment: {
    method: String (enum: ['razorpay']),
    razorpayOrderId: String,
    status: String
  },
  status: String (enum: ORDER_STATUS_VALUES, indexed),
  deliveredAt: Date,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

#### Inventory Collections (Base, Sauce, Cheese, Veggie)
```javascript
{
  _id: ObjectId,
  item: String,
  price: Number,
  quantity: Number,
  threshold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes

Optimized queries with strategic indexing:

```javascript
// Users
email: 1 (unique)
isVerified: 1

// Admins  
email: 1 (unique)
isApproved: 1
role: 1

// Pizzas
createdBy: 1
price: 1
size: 1
createdAt: -1

// Orders
user: 1
status: 1
createdAt: -1
{ user: 1, createdAt: -1 } (compound)
{ status: 1, createdAt: -1 } (compound)
```

---

## Authentication Flow

### JWT-Based Authentication

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant DB as Database
    
    C->>API: POST /login (email, password)
    API->>DB: Find user by email
    DB-->>API: User document
    API->>API: Compare password (bcrypt)
    API->>API: Generate JWT token
    API-->>C: User data + token
    C->>C: Store token in localStorage
    
    Note over C,API: Subsequent Requests
    
    C->>API: GET /protected (Authorization: Bearer token)
    API->>API: Verify JWT signature
    API->>API: Decode user ID from token
    API->>DB: Find user by ID
    DB-->>API: User document
    API->>API: Attach user to req.user
    API-->>C: Protected resource
```

### Route Protection

**Frontend:**
- `ProtectedRoute` - Requires authentication
- `AdminRoute` - Requires admin role
- `UserRoute` - Requires user role

**Backend:**
- `authenticateUser` - Verifies JWT token
- `authenticateAdmin` - Verifies admin JWT
- `checkAdminApproval` - Checks admin approval status

---

## Payment Flow

### Razorpay Integration

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant R as Razorpay
    participant DB as Database
    
    U->>F: Click "Checkout"
    F->>B: POST /orders/checkout {amount}
    B->>R: Create Razorpay order
    R-->>B: {id, amount, currency}
    B-->>F: Razorpay order details
    
    F->>F: Open Razorpay modal
    U->>R: Enter card details
    R->>R: Process payment
    R->>B: Webhook: payment.captured
    
    B->>B: Verify webhook signature
    B->>DB: Check inventory
    B->>DB: Deduct inventory
    B->>DB: Create order record
    DB-->>B: Order saved
    
    B->>F: Payment success
    F-->>U: Show confirmation
```

### Payment States
- **Created**: Razorpay order created
- **Authorized**: Payment authorized (pending capture)
- **Captured**: Payment successful
- **Failed**: Payment failed

---

## Error Handling

### Error Architecture

```mermaid
graph LR
    Request[API Request]
    Validator[Validator<br/>Middleware]
    Controller[Controller<br/>Business Logic]
    Error{Error<br/>Occurred?}
    ApiError[ApiError<br/>Class]
    ErrorMw[Error<br/>Middleware]
    Response[Structured<br/>JSON Response]
    
    Request --> Validator
    Validator -->|Valid| Controller
    Validator -->|Invalid| ApiError
    Controller --> Error
    Error -->|Yes| ApiError
    Error -->|No| Response
    ApiError --> ErrorMw
    ErrorMw --> Response
    
    style ApiError fill:#ff6b6b
    style ErrorMw fill:#feca57
    style Response fill:#48dbfb
```

### Error Response Format

```javascript
// Error Response
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Please check your input',
    details: [
      { field: 'email', message: 'Email is required' }
    ],
    timestamp: '2026-02-22T...',
    path: '/api/users/login',
    requestId: 'req_abc123'
  }
}

// Success Response
{
  success: true,
  data: { ... },
  message: 'Operation successful'
}
```

See [Error Handling Guide](./ERROR_HANDLING.md) for details.

---

## Constants Management

### Duplicated Constants Architecture

```mermaid
graph TB
    subgraph BackendConstants[Backend - server/constants/]
        BackOrder[orderStatus.js]
        BackPizza[pizzaSizes.js]
        BackInv[inventoryTypes.js]
        BackPay[paymentConstants.js]
        BackRole[userRoles.js]
        BackError[errorCodes.js]
        BackIndex[index.js]
        
        BackIndex -->|exports| BackOrder
        BackIndex -->|exports| BackPizza
        BackIndex -->|exports| BackInv
        BackIndex -->|exports| BackPay
        BackIndex -->|exports| BackRole
        BackIndex -->|exports| BackError
    end
    
    subgraph FrontendConstants[Frontend - client/src/constants/]
        FrontOrder[orderStatus.js]
        FrontPizza[pizzaSizes.js]
        FrontInv[inventoryTypes.js]
        FrontPay[paymentConstants.js]
        FrontRole[userRoles.js]
        FrontIndex[index.js]
        
        FrontIndex -->|exports| FrontOrder
        FrontIndex -->|exports| FrontPizza
        FrontIndex -->|exports| FrontInv
        FrontIndex -->|exports| FrontPay
        FrontIndex -->|exports| FrontRole
    end
    
    BackendConstants -.->|Duplicated<br/>Keep in sync| FrontendConstants
    
    subgraph BackendUsage[Backend Usage]
        Schemas[Mongoose Schemas]
        Validators[Validators]
        Controllers[Controllers]
        Seeds[Seed Data]
    end
    
    subgraph FrontendUsage[Frontend Usage]
        Components[Components]
        Screens[Screens]
        Redux[Redux Logic]
    end
    
    BackendConstants --> BackendUsage
    FrontendConstants --> FrontendUsage
```

**Why Duplicated?**
- No shared package complexity
- Independent deployment
- Type safety per environment
- Simpler build process

**Keeping in Sync:**
- Manual synchronization when updating
- Both index.js files document this requirement
- Values should always match

See [Constants Guide](./CONSTANTS.md) for complete reference.

---

## State Management

### Redux Architecture

```mermaid
graph TB
    Component[React Component]
    Action[Dispatch Action]
    Thunk[Async Thunk]
    API[API Call]
    Slice[Redux Slice]
    Store[Redux Store]
    
    Component -->|User action| Action
    Action --> Thunk
    Thunk -->|HTTP Request| API
    API -->|Response| Thunk
    Thunk -->|Update state| Slice
    Slice --> Store
    Store -->|Subscribe| Component
    
    style Thunk fill:#764abc
    style Slice fill:#764abc
    style Store fill:#764abc
```

### Redux Slices

1. **userSlice** - User authentication and profile
2. **adminSlice** - Admin authentication
3. **pizzaSlice** - Pizza CRUD operations
4. **orderSlice** - Order management
5. **inventorySlice** - Inventory management
6. **cartSlice** - Shopping cart

---

## Security Architecture

### Security Layers

```mermaid
graph TB
    Request[Incoming Request]
    Helmet[Helmet<br/>Security Headers]
    RateLimit[Rate Limiting]
    CORS[CORS<br/>Origin Check]
    Sanitize[Mongo Sanitize<br/>NoSQL Injection]
    JWT[JWT Auth<br/>Middleware]
    Validator[Input Validation]
    Controller[Controller Logic]
    
    Request --> Helmet
    Helmet --> RateLimit
    RateLimit --> CORS
    CORS --> Sanitize
    Sanitize --> JWT
    JWT --> Validator
    Validator --> Controller
```

### Security Features

1. **Helmet** - Sets secure HTTP headers
2. **Rate Limiting** - Prevents brute force attacks
3. **CORS** - Restricts cross-origin requests
4. **Input Sanitization** - Prevents NoSQL injection
5. **JWT Authentication** - Stateless auth
6. **Password Hashing** - bcrypt with salt rounds
7. **express-validator** - Input validation
8. **Razorpay Signature Verification** - Payment security

---

## Performance Optimizations

### Database
- Strategic indexing on frequently queried fields
- Aggregation pipelines for analytics
- Connection pooling (poolSize: 10)
- Efficient populate() queries

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Redux for state management
- Memoization where needed

### Backend
- Pagination for large datasets
- Rate limiting to prevent abuse
- Async/await for non-blocking operations
- Environment-based logging

---

## Scalability Considerations

### Current Architecture
- Monolithic backend
- Single database instance
- Serverless deployment (Vercel)

### Future Scalability
- Microservices architecture
- Database replication
- Caching layer (Redis)
- CDN for static assets
- Load balancing
- Message queues for async tasks

---

## Related Documentation

- [Setup Guide](./SETUP.md) - Installation instructions
- [API Reference](./API.md) - API endpoints
- [Error Handling](./ERROR_HANDLING.md) - Error patterns
- [Constants](./CONSTANTS.md) - Constants reference

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0
