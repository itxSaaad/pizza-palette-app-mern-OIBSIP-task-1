# Stripe Setup Guide

Complete guide for setting up Stripe payments for local development on Pizza Palette.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Create a Stripe Account](#create-a-stripe-account)
- [Install the Stripe CLI](#install-the-stripe-cli)
- [Get Your API Keys](#get-your-api-keys)
- [Configure Environment Variables](#configure-environment-variables)
- [Forward Webhooks Locally](#forward-webhooks-locally)
- [Test a Payment End-to-End](#test-a-payment-end-to-end)
- [Troubleshooting](#troubleshooting)
- [Going Live](#going-live)

---

## Overview

Pizza Palette uses **Stripe Checkout** for payments — the backend creates a
Stripe-hosted checkout session and redirects the browser to it
(`window.location.href = session.url`). There is no Stripe.js/Elements
integration on the frontend; the client never handles card details directly,
so no Stripe publishable key is needed in `client/.env`.

Two pieces of Stripe configuration matter for local development:

1. **`STRIPE_SECRET_KEY`** — used server-side to create checkout sessions.
2. **`STRIPE_WEBHOOK_SECRET`** — used server-side to verify that webhook
   events (payment success/failure) genuinely came from Stripe.

---

## Prerequisites

- A Stripe account (free to create, no business verification needed for test mode)
- Homebrew (macOS) or your platform's package manager, to install the Stripe CLI
- This repo's backend already set up per [SETUP.md](./SETUP.md)

---

## Create a Stripe Account

1. Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up (email + password, or Google/Apple/Microsoft sign-in)
3. You do **not** need to complete business/KYC verification to use test mode —
   skip any "activate your account" prompts for now. Test mode works immediately.

---

## Install the Stripe CLI

The Stripe CLI is what lets you receive real Stripe webhook events on your
local machine during development (Stripe's servers can't reach `localhost`
directly).

**macOS (Homebrew):**

```bash
brew install stripe/stripe-cli/stripe
```

**Other platforms:** see [Stripe's CLI install docs](https://docs.stripe.com/stripe-cli).

Verify it installed:

```bash
stripe --version
```

---

## Get Your API Keys

You have two ways to get test-mode keys.

### Option A: Dashboard (recommended for `STRIPE_SECRET_KEY`)

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Make sure the **Test mode** toggle (top-right) is ON
3. Go to **Developers → API keys**
4. Copy the **Secret key** (starts with `sk_test_...`)

> **Important:** the secret key starts with `sk_test_`, not `pk_test_`. The
> `pk_test_` key is the _publishable_ key and is not used anywhere in this
> project (Checkout is hosted by Stripe, not embedded client-side) — don't
> put a `pk_test_` value in `STRIPE_SECRET_KEY`, the server will fail to
> start.

### Option B: Stripe CLI login (webhook forwarding only)

```bash
stripe login
```

This opens a browser to confirm a pairing code, then links the CLI to your
Stripe account — useful for `stripe listen` (webhook forwarding, below).

> **Don't use `stripe config --list`'s `test_mode_api_key` for
> `STRIPE_SECRET_KEY`.** That's a CLI-generated _restricted_ key that
> expires after 90 days — fine for a quick local test, but it will silently
> stop working in any long-lived `.env` file. Always get `STRIPE_SECRET_KEY`
> from the Dashboard (Option A) instead.

---

## Configure Environment Variables

In the root `.env` file (see [SETUP.md](./SETUP.md#environment-configuration)
for the full list), set:

```bash
STRIPE_SECRET_KEY=sk_test_your_actual_test_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_local_webhook_secret_here
```

The `STRIPE_WEBHOOK_SECRET` value comes from `stripe listen` — see the next
section. Don't use a placeholder value here; the webhook route will
correctly reject every event with a `400` if the secret doesn't match what
signed the incoming request, so a placeholder means webhooks silently never work.

No frontend (`client/.env`) Stripe configuration is needed for local
development, since the app doesn't use Stripe.js/Elements client-side.

---

## Forward Webhooks Locally

In a separate terminal (leave this running while you develop):

```bash
stripe listen --forward-to localhost:5000/api/orders/stripe-webhook
```

This prints something like:

```
Ready! You are using Stripe API Version [...]. Your webhook signing secret is whsec_xxxxxxxxxxxx (^C to quit)
```

Copy that `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in your `.env`, then
(re)start the backend so it picks up the new value:

```bash
npm run server
```

> **Note:** this webhook secret is generated fresh **every time** you run
> `stripe listen` — it's not a permanent value like your API key. If you
> restart `stripe listen` in a new session, update `.env` again with the new
> secret it prints, or your webhook signature checks will fail until you do.

---

## Test a Payment End-to-End

With both `npm run server` (or `npm run dev` from repo root, which starts
both frontend and backend) and `stripe listen` running:

### Full flow through the UI

1. Log in as a test user (see [TESTING.md](./TESTING.md) for credentials)
2. Add a pizza to your cart and proceed to checkout
3. Choose the Stripe payment method and submit — you'll be redirected to a
   Stripe-hosted checkout page
4. Use a [Stripe test card](https://docs.stripe.com/testing#cards):
   - **Success:** `4242 4242 4242 4242`, any future expiry, any 3-digit CVC, any ZIP
   - **Decline:** `4000 0000 0000 0002`
5. After completing payment, Stripe redirects back to
   `/checkout/success` (or `/checkout/cancel`), and — separately — sends a
   webhook event to your `stripe listen` tunnel, which forwards it to your
   local server to confirm the order

### Faster: trigger a webhook event directly (skips the UI)

Useful for testing the webhook handler in isolation without going through
checkout each time:

```bash
stripe trigger checkout.session.completed
```

You should see a `200` response logged in the `stripe listen` terminal, and
`Unhandled event type ...` or normal processing logs in the server terminal
(a directly-triggered test event won't match a real order ID, so you may see
an "Order not found" log line — that's expected for a synthetic test event,
not a bug, since it wasn't created through a real checkout session).

---

## Troubleshooting

### Server crashes on startup: `Error: Neither apiKey nor config.authenticator provided`

`STRIPE_SECRET_KEY` is missing or empty in `.env`. Double check the variable
name and that `.env` is in the **repo root** (not inside `server/`) — the
backend's `dotenv.config()` reads from whatever directory the process is
launched from, and the documented `npm run server` / `npm run dev` scripts
(run from the repo root) are what correctly pick up the root `.env`. If you
`cd server` and run `npm run dev` directly instead, `.env` won't be found.

### Webhook always returns 400: `Webhook payload must be provided as a string or Buffer`

This was a real bug in this codebase (fixed in commit `cf14df7`) — the
webhook route needs the **raw** request body for signature verification, but
earlier versions of `server/index.js` ran global JSON body parsers before the
webhook route was mounted, consuming the body first. If you're on a version
of this repo from before that fix, pull the latest `dev` branch.

### Webhook always returns 400: signature verification failed (but the raw-body bug above is already fixed)

Your `STRIPE_WEBHOOK_SECRET` doesn't match the secret `stripe listen` printed
for your _current_ session. Re-copy it — remember it's regenerated every time
you restart `stripe listen`.

### Payment succeeds in Stripe but the order never updates

Check that `stripe listen --forward-to localhost:5000/api/orders/stripe-webhook`
is actually running and pointed at the right port (`PORT` in `.env`, default
`5000`). If `npm run dev` is using a different port, adjust the `--forward-to`
URL to match.

---

## Going Live

When ready for production:

1. Complete Stripe's account activation (business details, bank account) in
   the dashboard — required to accept real payments
2. Toggle **Live mode** in the dashboard, generate live API keys
   (`sk_live_...`)
3. In your production environment (e.g. Vercel), set `STRIPE_SECRET_KEY` to
   the live secret key
4. Create a **live webhook endpoint** in the dashboard (Developers →
   Webhooks → Add endpoint), pointing to your real deployed URL:
   `https://your-backend.example.com/api/orders/stripe-webhook`. Select at
   minimum the `checkout.session.completed` and `payment_intent.payment_failed`
   events (matching what `handleStripeWebhook` in
   `server/controllers/orderControllers.js` handles). Note that
   `payment_intent.payment_failed` delivers a PaymentIntent object, not the
   Checkout Session — `createStripeCheckoutSession` sets `orderId`/`userId`
   on `payment_intent_data.metadata` (in addition to the session-level
   `metadata`) specifically so this event still carries the order ID.
5. Copy the **signing secret** shown for that live endpoint into your
   production `STRIPE_WEBHOOK_SECRET` — this is different from your local
   `stripe listen` secret and does not expire/regenerate on its own.
6. Test with a small real charge before considering it production-ready.

---

## Related Documentation

- [Setup Guide](./SETUP.md) — general environment setup
- [Deployment Guide](./DEPLOYMENT.md) — production deployment
- [Testing Guide](./TESTING.md) — test credentials and scenarios
- [API Reference](./API.md) — order/checkout endpoint reference
