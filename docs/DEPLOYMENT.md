# Deployment Guide

Complete guide for deploying Pizza Palette to production on Vercel.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Stripe Live Mode](#stripe-live-mode)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Overview

Pizza Palette uses Vercel for both frontend and backend deployment:
- **Frontend:** Static React app with Vite
- **Backend:** Serverless functions (Express API)
- **Database:** MongoDB Atlas (cloud)
- **Payments:** Stripe (live mode)
- **CI/CD:** Automatic deployment via GitHub integration

### Architecture

```
User Browser
     ↓
Vercel Frontend (React)
     ↓
Vercel Backend (Serverless)
     ↓
MongoDB Atlas
     ↓
Stripe API
```

---

## Prerequisites

Before deploying:

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] MongoDB Atlas account
- [ ] Stripe account (activated for live mode — see [Stripe Setup Guide](./STRIPE_SETUP.md#going-live))
- [ ] Domain name (optional)
- [ ] All code pushed to GitHub

---

## Vercel Deployment

### Step 1: Connect GitHub Repository

1. **Login to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

### Step 2: Deploy Backend

This repo is a **pnpm workspace with Turborepo** (`pnpm-workspace.yaml` +
`turbo.json` at the repo root). Once Vercel detects `turbo.json` anywhere
above the project's Root Directory, it switches to a Turborepo-driven build
that expects a static output directory — this silently breaks the old
zero-config "auto-detect an Express entry file" behavior for a build-less
API project. Because of this, the backend **does** need a `server/vercel.json`
(unlike before the monorepo migration) plus a function entry file under
`server/api/`:

- `server/api/index.js` re-exports the real Express app from `server/index.js`
  (`module.exports = require('../index.js')`) — Vercel's current Node.js
  Functions convention requires function files to live under `api/`.
- `server/index.js` ends with `module.exports = app;` so that re-export works;
  it still also calls `app.listen(...)` for local dev via `pnpm dev`/nodemon,
  which is harmless in the deployed serverless function.
- `server/vercel.json` sets `outputDirectory: "public"` (a placeholder
  directory — `server/public/README.txt` — exists purely to satisfy Vercel's
  static-output check; it serves no real content) and routes all traffic to
  the function via `rewrites`:
  ```json
  {
    "outputDirectory": "public",
    "functions": { "api/index.js": { "maxDuration": 30 } },
    "rewrites": [{ "source": "/(.*)", "destination": "/api/index.js" }]
  }
  ```
  Don't delete `server/vercel.json`, `server/api/index.js`, or `server/public/`
  — all three are load-bearing for this deployment shape.

1. **Configure Backend Project**
   - **Framework Preset:** Other
   - **Root Directory:** `./server`
   - **Build Command:** *(leave as detected — Turborepo runs it automatically; `server` has no `build` script, so this is a no-op)*
   - **Output Directory:** *(leave as detected — comes from `server/vercel.json`'s `outputDirectory`)*
   - **Install Command:** *(leave as detected — Vercel auto-detects `pnpm install` from the root `pnpm-lock.yaml`)*

2. **Environment Variables**
   Add all backend environment variables (see [Environment Variables](#environment-variables) section):
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=...
   FRONTEND_URL=https://your-frontend.vercel.app
   ... (all other variables)
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend

This app is a client-side-routed single-page app (React Router's
`createBrowserRouter`), so deep links like `/menu` or `/my-orders/:id` need
to be rewritten to `/index.html` or Vercel will 404 on a hard refresh/direct
visit. `client/vercel.json` already contains the required `rewrites` rule —
no additional configuration is needed, but don't remove that file.

1. **Import Project Again**
   - Create new project in Vercel
   - Select same GitHub repository
   - This time, configure for frontend

2. **Configure Frontend Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./client`
   - **Build Command:** *(leave as detected — Turborepo runs `vite build` via the workspace; `client` has a real `build` script, so this produces `dist/` normally, unlike the backend)*
   - **Output Directory:** `dist`
   - **Install Command:** *(leave as detected — Vercel auto-detects `pnpm install` from the root `pnpm-lock.yaml`)*

3. **Environment Variables**
   ```
   VITE_SERVER_URL=https://your-backend.vercel.app/api
   VITE_CLIENT_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Note the frontend URL

### Step 4: Update Backend Environment

1. Go to backend project in Vercel
2. Settings → Environment Variables
3. Update `FRONTEND_URL` to your actual frontend URL
4. Update `ALLOWED_ORIGINS` if needed
5. Redeploy backend

---

## Environment Variables

### Backend Environment Variables (Vercel Project Settings)

```bash
# Environment
NODE_ENV=production

# Server
PORT=5000

# Frontend URL (CRITICAL: Update after frontend deployed)
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza-delivery-app?retryWrites=true&w=majority

# Authentication
JWT_SECRET=<64+ character random string>
SALT=10

# Email (Zoho Mail App Password, or override SMTP_HOST for another provider)
SENDER_EMAIL=your-email@example.com
SENDER_PASSWORD=your-app-password

# Payment Gateway (Stripe LIVE)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Frontend Environment Variables (Vercel Project Settings)

```bash
# API URL (CRITICAL: Use your backend URL)
VITE_SERVER_URL=https://your-backend.vercel.app/api

# Client URL
VITE_CLIENT_URL=https://your-frontend.vercel.app

# No Stripe configuration is needed here — checkout redirects to a
# Stripe-hosted page server-side.
```

### How to Add in Vercel

1. Go to project in Vercel dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add each variable:
   - **Key:** Variable name (e.g., `MONGO_URI`)
   - **Value:** Variable value
   - **Environment:** Production (and preview if desired)
5. Click "Save"
6. Redeploy project

---

## Database Configuration

### MongoDB Atlas for Production

1. **Create Production Cluster**
   - Login to MongoDB Atlas
   - Create new cluster or use existing
   - Choose appropriate tier (M10+ for production)

2. **Create Database User**
   - Database Access → Add New Database User
   - Username: `pizza-app-prod`
   - Password: Strong password (save securely)
   - Roles: `Read and write to any database`

3. **Whitelist IP Addresses**
   - Network Access → IP Access List
   - For Vercel: Add `0.0.0.0/0` (allow from anywhere)
   - Note: Vercel uses dynamic IPs, so restricting by IP isn't practical

4. **Get Connection String**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with actual password
   - Replace `<database>` with `pizza-delivery-app`
   - Add to Vercel backend environment variables

### Database Indexes

Ensure indexes are created for optimal performance:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ isVerified: 1 })

// Admins
db.admins.createIndex({ email: 1 }, { unique: true })
db.admins.createIndex({ isApproved: 1 })
db.admins.createIndex({ role: 1 })

// Pizzas
db.pizzas.createIndex({ createdBy: 1 })
db.pizzas.createIndex({ createdAt: -1 })

// Orders
db.orders.createIndex({ user: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ user: 1, createdAt: -1 })
db.orders.createIndex({ status: 1, createdAt: -1 })
```

### Seed Production Database

```bash
# Connect to production database
# Update .env with production MONGO_URI temporarily
pnpm run data:import

# Or use MongoDB Compass:
# 1. Connect to Atlas cluster
# 2. Import JSON files from server/data/
```

---

## Stripe Live Mode

Full walkthrough — account activation, generating live keys, creating the live webhook endpoint (`https://your-backend.vercel.app/api/orders/stripe-webhook`), and which events to select — is in the [Stripe Setup Guide's "Going Live" section](./STRIPE_SETUP.md#going-live). Summary:

1. Complete Stripe's account activation in the dashboard (required for real payments).
2. Toggle Live mode, generate live keys, set `STRIPE_SECRET_KEY` (`sk_live_...`) in Vercel's backend project env vars.
3. Create a live webhook endpoint pointing at your deployed backend, select `checkout.session.completed` and `payment_intent.payment_failed`, and set the resulting signing secret as `STRIPE_WEBHOOK_SECRET`.
4. Test with a small real charge before considering it production-ready.

No frontend (Vercel frontend project) environment variables are needed for Stripe — checkout redirects to a Stripe-hosted page server-side.

### Important Live Mode Notes

⚠️ **Production Considerations:**
- Test thoroughly in test mode first
- Use real payments only after complete testing
- Monitor the Stripe Dashboard's Events/Payments views for failed transactions
- Set up Stripe email alerts for failed payments and disputes

---

## Post-Deployment

### Deployment Checklist

After deployment, verify:

#### Backend
- [ ] API responds at `https://your-backend.vercel.app/api`
- [ ] Health check endpoint works
- [ ] Database connection successful
- [ ] JWT authentication works
- [ ] File upload works (if applicable)
- [ ] Email sending works
- [ ] Stripe checkout session creation works
- [ ] Webhooks receiving properly
- [ ] Error handling correct
- [ ] Logs visible in Vercel dashboard

#### Frontend
- [ ] Site loads at `https://your-frontend.vercel.app`
- [ ] All pages render correctly
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Pizza menu displays
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Redirects to Stripe-hosted checkout
- [ ] Payment completes successfully
- [ ] Order confirmation displays
- [ ] Admin dashboard accessible

#### Integration
- [ ] Frontend communicates with backend
- [ ] CORS configured correctly
- [ ] Cookies/tokens working
- [ ] Payment integration end-to-end
- [ ] Email notifications sent
- [ ] Inventory updates correctly

### Update Repository URLs

Update any hardcoded URLs in:
- README.md
- Documentation files
- Environment examples

### Configure Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to project Settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `FRONTEND_URL` in backend
   - Update `ALLOWED_ORIGINS` in backend
   - Update `VITE_CLIENT_URL` in frontend
   - Update `VITE_SERVER_URL` if backend has custom domain

3. **Update Stripe Webhook**
   - Update the webhook endpoint URL in the Stripe Dashboard to use the custom domain
   - Test webhook delivery

---

## Monitoring

### Vercel Analytics

1. **Enable Analytics**
   - Go to project in Vercel
   - Click "Analytics"
   - View metrics:
     - Page views
     - Unique visitors
     - Top pages
     - Performance metrics

2. **Enable Logs**
   - Go to project in Vercel
   - Click "Logs"
   - View real-time logs
   - Filter by severity

### Application Monitoring

1. **Error Tracking**
   - Monitor Vercel function logs
   - Set up alerts for 500 errors
   - Check error rate in analytics

2. **Database Monitoring**
   - MongoDB Atlas → Metrics
   - Monitor:
     - Connection count
     - Query performance
     - Storage usage
     - Slow queries

3. **Payment Monitoring**
   - Stripe Dashboard → Payments / Analytics
   - Track:
     - Success rate
     - Failed payments
     - Average transaction value
     - Refunds

### Set Up Alerts

1. **Vercel Deployment Alerts**
   - Settings → Notifications
   - Enable deployment notifications
   - Add email or Slack webhook

2. **MongoDB Atlas Alerts**
   - Project → Alerts
   - Configure alerts for:
     - High CPU usage
     - Low storage
     - Connection spikes

3. **Stripe Alerts**
   - Settings → Alerts
   - Configure alerts for:
     - Payment failures
     - High refund rate
     - Webhook failures

---

## Troubleshooting

### Deployment Fails

**Problem:** Build fails in Vercel

**Solutions:**
1. Check build logs in Vercel
2. Verify `package.json` scripts
3. Ensure all dependencies in `package.json`
4. Test build locally:
   ```bash
   pnpm --filter client build
   ```

### API Not Responding

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Verify `VITE_SERVER_URL` is correct
2. Check CORS configuration
3. Verify backend is deployed and running
4. Check Vercel function logs
5. Test API directly:
   ```bash
   curl https://your-backend.vercel.app/api/pizzas
   ```

### Database Connection Error

**Problem:** `MongoNetworkError` or connection timeout

**Solutions:**
1. Verify `MONGO_URI` is correct
2. Check MongoDB Atlas IP whitelist (0.0.0.0/0)
3. Verify database user credentials
4. Check cluster status in Atlas
5. Review connection string format

### Payment Issues

**Problem:** Stripe payment not working

**Solutions:**
1. Verify live keys are used (`sk_live_...`, not `sk_test_...`)
2. Verify the live webhook endpoint URL in the Stripe Dashboard is accessible and matches your deployed backend
3. Check `STRIPE_WEBHOOK_SECRET` matches the live endpoint's signing secret (not the local `stripe listen` one)
4. Check webhook signature verification errors in the backend logs
5. Review the Stripe Dashboard's Events log for delivery failures

### Environment Variables Not Working

**Problem:** Variables not available in application

**Solutions:**
1. Verify variables are added in Vercel dashboard
2. Check variable names (no typos)
3. Ensure "Production" environment selected
4. Redeploy after adding variables
5. For frontend: Must start with `VITE_`

### CORS Errors

**Problem:** `Access-Control-Allow-Origin` error

**Solutions:**
1. Verify `FRONTEND_URL` in backend env
2. Check `ALLOWED_ORIGINS` includes frontend URL
3. Ensure frontend URL is exact match (no trailing slash)
4. Verify CORS middleware is applied
5. Check browser network tab for details

---

## Rollback Strategy

If deployment has critical issues:

### Quick Rollback

1. **Vercel Dashboard**
   - Go to "Deployments"
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **GitHub Revert**
   ```bash
   git revert HEAD
   git push origin main
   # Vercel auto-deploys
   ```

### Gradual Rollout

1. Use Vercel preview deployments
2. Test thoroughly in preview
3. Promote to production when ready
4. Monitor closely after promotion

---

## CI/CD Pipeline

Vercel provides automatic CI/CD:

### Automatic Deployment

- **Push to `main`:** Deploys to production
- **Push to other branch:** Creates preview deployment
- **Pull request:** Creates preview deployment with comment

### Build Configuration

Both projects need a `vercel.json` — this changed once the repo became a
pnpm/Turborepo workspace (see [Step 2](#step-2-deploy-backend) for why).
`client/vercel.json` only needs its client-side-routing `rewrites` rule (the
frontend's own **Framework Preset: Vite**, **Root Directory: `./client`**
settings handle the build/output otherwise). `server/vercel.json` needs the
`outputDirectory`/`functions`/`rewrites` config described in
[Step 2](#step-2-deploy-backend) — don't delete either file.

---

## Security Considerations

### Production Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS only (enforced by Vercel)
- [ ] Secure cookies configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] MongoDB injection prevention (sanitization)
- [ ] XSS protection (Helmet)
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] Dependencies up to date
- [ ] Database backups enabled

---

## Performance Optimization

### Frontend Optimization

- Code splitting implemented
- Lazy loading for routes
- Image optimization
- Minification enabled (Vite)
- Caching headers configured

### Backend Optimization

- Database queries optimized
- Indexes created
- Connection pooling enabled
- Response compression
- Rate limiting configured

### CDN Configuration

Vercel automatically provides:
- Edge network distribution
- Asset caching
- HTTP/2 support
- Image optimization

---

## Related Documentation

- [Setup Guide](./SETUP.md) - Local development
- [Testing Guide](./TESTING.md) - Testing procedures
- [Architecture](./ARCHITECTURE.md) - System design

---

**Last Updated:** February 22, 2026  
**Version:** 2.0.0
