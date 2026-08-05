# Setup Guide

Complete guide to set up Pizza Palette application for development and production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [First Time Setup](#first-time-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Razorpay Setup](#razorpay-setup)
- [Email Configuration](#email-configuration)
- [Seed Database](#seed-database)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - Version control

### Recommended
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing
- **VS Code** - Code editor

---

## First Time Setup

### 1. Clone the Repository

```bash
git clone https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1.git
cd pizza-palette-app-mern-OIBSIP-task-1
```

### 2. Install Dependencies

This repo is a [pnpm](https://pnpm.io) workspace ([Turborepo](https://turbo.build)
for task running), not a plain npm project. Install pnpm first if you don't
have it (`corepack enable` on Node 16.13+, or `npm install -g pnpm`), then
install everything — one command installs both `client` and `server`:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create `.env` files for both backend and frontend:

```bash
# Create backend .env (copy from example)
cp .env.example .env

# Create frontend .env
cd client
cp .env.example .env
cd ..
```

---

## Environment Configuration

### Backend Environment Variables (.env)

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL (used in emails, CORS)
FRONTEND_URL=http://localhost:5173

# CORS Configuration (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# MongoDB Connection
# Local:
MONGO_URI=mongodb://localhost:27017/pizza-delivery-app
# Or Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza-delivery-app

# Authentication
# Generate: openssl rand -base64 64
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
SALT=10

# Email Configuration (Nodemailer)
# For Gmail: Enable 2FA and create App Password
SENDER_EMAIL=your_email@example.com
SENDER_PASSWORD=your_email_app_password

# Payment Gateway (Razorpay)
# Get from: https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Frontend Environment Variables (client/.env)

```bash
# Server API URL
VITE_SERVER_URL=http://localhost:5000/api

# Client URL (for redirects)
VITE_CLIENT_URL=http://localhost:5173

# Razorpay Key (must match backend)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### Production Environment Variables

For Vercel deployment, set these in the Vercel dashboard:

**Backend (Serverless):**
- NODE_ENV=production
- FRONTEND_URL=https://your-frontend.vercel.app
- MONGO_URI=mongodb+srv://...
- JWT_SECRET=(64+ character secret)
- All other variables from .env

**Frontend:**
- VITE_SERVER_URL=https://your-backend.vercel.app/api
- VITE_CLIENT_URL=https://your-frontend.vercel.app
- VITE_RAZORPAY_KEY_ID=rzp_live_xxx (for live mode)

---

## Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Server**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**
   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB as a Windows service
   ```

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   ```

4. **Update .env**
   ```bash
   MONGO_URI=mongodb://localhost:27017/pizza-delivery-app
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Atlas Account**
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Grant "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<database>` with `pizza-delivery-app`

6. **Update .env**
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza-delivery-app
   ```

---

## Razorpay Setup

### Quick Setup

1. **Create Razorpay Account**
   - Sign up at [razorpay.com](https://razorpay.com/)
   - Complete KYC for live mode (optional for testing)

2. **Get Test API Keys**
   - Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
   - Switch to "Test Mode" (top-right toggle)
   - Navigate to **Settings** → **API Keys**
   - Generate test keys if not present
   - Copy Key ID and Key Secret

3. **Configure Webhook**
   - Go to **Settings** → **Webhooks**
   - Click "Create New Webhook"
   - **URL**: `http://localhost:5000/api/orders/webhook` (use ngrok for local testing)
   - **Events**: Select `payment.authorized`, `payment.captured`, `payment.failed`
   - **Secret**: Generate or copy provided secret
   - Save webhook

4. **Update .env Files**
   ```bash
   # Backend .env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   RAZORPAY_WEBHOOK_SECRET=xxxxx
   
   # Frontend client/.env
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

For detailed Razorpay configuration, see [RAZORPAY_SETUP.md](../RAZORPAY_SETUP.md).

---

## Email Configuration

The backend sends transactional emails (verification, password reset, order
status updates) via [Nodemailer](https://nodemailer.com/), configured
through environment variables so any SMTP provider can be used — it
defaults to Zoho Mail if `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE` are left
unset.

### Using Zoho Mail (default)

1. **Generate an App-Specific Password**
   - Log in to [Zoho Mail](https://mail.zoho.com)
   - Go to **Settings → Security → App Passwords**
   - Generate a new app password for "Pizza Palette"
   - Copy the generated password

2. **Update .env**
   ```bash
   SENDER_EMAIL=your.email@yourdomain.com
   SENDER_PASSWORD=your_zoho_app_password
   ```

   `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE` don't need to be set for Zoho's
   global (US) data center — they default to `smtp.zoho.com:465` (SSL). If
   your account is on a different Zoho data center (e.g. India), set:
   ```bash
   SMTP_HOST=smtp.zoho.in
   ```

### Using a Different Provider (e.g. Gmail)

Override the SMTP settings explicitly:

```bash
SENDER_EMAIL=your.email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx  # App password, not your regular password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

For Gmail specifically: enable 2-Factor Authentication in your Google
Account, then go to **Security → App passwords** to generate one.

---

## Seed Database

Populate the database with test data:

### Import Data

```bash
# From root directory
pnpm run data:import

# Or manually
cd server
node seeder.js
```

**Output:**
```
✅ Database seeded successfully!

TEST CREDENTIALS:
Admin: admin1@pizzapalette.com / Admin@123456
Admin: admin2@pizzapalette.com / Manager@123456
User: john@example.com / User@123456
User: jane@example.com / User@123456
User: test@example.com / User@123456
```

### Destroy Data

```bash
# From root directory
pnpm run data:destroy

# Or manually
cd server
node seeder.js -d
```

### What Gets Seeded:
- 2 admin users (admin + manager)
- 3 regular users (2 verified, 1 unverified)
- 6 pizzas with various sizes
- Inventory items (bases, sauces, cheeses, veggies)

---

## Running the Application

### Development Mode

**Option 1: Run Both (Recommended)**
```bash
# From root directory
pnpm run dev
```

This uses Turborepo to run both packages' `dev` tasks in parallel:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend
pnpm --filter server dev

# Terminal 2 - Frontend
pnpm --filter client dev
```

### Production Mode

```bash
# Build frontend
pnpm --filter client build

# Start backend
pnpm --filter server start
```

---

## Verify Installation

### 1. Check Backend

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-22T..."
}
```

### 2. Check Frontend

Open browser: [http://localhost:5173](http://localhost:5173)

You should see the Pizza Palette homepage.

### 3. Test Login

- Navigate to Login
- Use test credentials: `john@example.com` / `User@123456`
- Should successfully log in and redirect to menu

### 4. Test API

```bash
# Get all pizzas
curl http://localhost:5000/api/pizzas

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"User@123456"}'
```

---

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running:
   ```bash
   # macOS
   brew services list | grep mongodb
   
   # Linux
   systemctl status mongod
   ```

2. Check MONGO_URI in `.env`
3. For Atlas: Verify IP whitelist
4. Check username/password in connection string

### JWT Secret Warning

**Warning:** `JWT_SECRET should be at least 32 characters long`

**Solution:**
Generate a strong secret:
```bash
# Option 1: OpenSSL
openssl rand -base64 64

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Update `.env` with the generated secret.

### Email Not Sending

**Problem:** Registration emails not arriving

**Solutions:**
1. Check email credentials in `.env`
2. For Gmail: Verify App Password is correct
3. Check spam folder
4. Review server logs for email errors
5. Test email service:
   ```bash
   # Create test script
   node -e "const sendEmail = require('./server/middlewares/nodemailerMiddleware'); sendEmail({to: 'test@example.com', subject: 'Test', text: 'Test email'})"
   ```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill existing process:
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. Change port in `.env`:
   ```bash
   PORT=5001
   ```

### Razorpay Payment Fails

**Problem:** Payment fails in test mode

**Solutions:**
1. Verify RAZORPAY_KEY_ID matches in backend and frontend
2. Check test card: `4111 1111 1111 1111`
3. Review Razorpay dashboard for error logs
4. Check browser console for errors

### CORS Error

**Error:** `Access-Control-Allow-Origin` blocked

**Solutions:**
1. Verify FRONTEND_URL in backend `.env`
2. Check ALLOWED_ORIGINS includes frontend URL
3. Ensure frontend VITE_SERVER_URL is correct
4. For production: Update CORS origins to production URLs

### Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solutions:**
1. Reinstall dependencies:
   ```bash
   # From root directory (installs both client and server)
   rm -rf node_modules client/node_modules server/node_modules pnpm-lock.yaml
   pnpm install
   ```

2. Check Node.js version (must be 16+)
3. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Vite hot module replacement (HMR)
- Backend: Nodemon watches for file changes

### Debug Mode

Enable additional logging:
```bash
# Backend
NODE_ENV=development pnpm --filter server dev

# Check logs in terminal
```

### Database Inspection

**MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select `pizza-delivery-app` database
4. Browse collections: users, admins, pizzas, orders, etc.

**Command Line:**
```bash
mongosh
use pizza-delivery-app
db.users.find().pretty()
db.pizzas.find().pretty()
```

### Clear All Data

```bash
# Destroy all seeded data
pnpm run data:destroy

# Reseed fresh data
pnpm run data:import
```

---

## Quick Start Checklist

- [ ] Node.js and pnpm installed
- [ ] MongoDB running (local or Atlas)
- [ ] Git repository cloned
- [ ] Dependencies installed (`pnpm install` from root)
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Database seeded
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 5173)
- [ ] Can access homepage
- [ ] Can login with test credentials
- [ ] API endpoints responding

---

## Next Steps

After successful setup:
1. Review [Architecture Documentation](./ARCHITECTURE.md)
2. Check [API Reference](./API.md)
3. Read [Testing Guide](./TESTING.md)
4. See [Test Credentials](../TEST_CREDENTIALS.md)

---

## Need Help?

- Check [Troubleshooting](#troubleshooting) section above
- Search [GitHub Issues](https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1/issues)
- Create new issue with detailed error information
- Contact: saadstudent.cs@gmail.com
