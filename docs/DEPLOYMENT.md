# Deployment Guide

Pizza Palette ships its Vite customer/admin UI and Express API as services in one Vercel project. They share a deployment URL and are released atomically. MongoDB Atlas stores application data; Stripe hosts card checkout; Zoho SMTP sends email; Vercel Cron runs the production low-stock check.

## Service layout and routing

The repository root `vercel.json` is the deployment manifest:

| Service | Root | Runtime | Public routes |
| --- | --- | --- | --- |
| `frontend` | `client/` | Vite static SPA | `/` and all non-API paths; deep links fall back to `/index.html` |
| `backend` | `server/` | Express on Vercel Node.js | `/api`, `/api/*`, `/health`, `/ready` |

Vercel evaluates the root rewrite table in order, so API and health paths reach Express before the frontend catch-all. The backend receives the original `/api/...` path, matching its Express route mounts. `/api` returns the standard API success envelope; `/health` is a database-independent liveness probe; `/ready` returns the standard error envelope with HTTP 503 until MongoDB is connected. See [Health Checks and Login Troubleshooting](./operations/HEALTH_AND_LOGIN.md) for response shapes and first-admin setup.

The backend exports the Express app for Vercel and calls `listen()` only when run directly. It awaits a shared Mongoose connection promise before API routes access models. `MONGODB_MAX_POOL_SIZE` can tune the pool per warm instance; its default is five connections to limit connection pressure on hobby databases.

## Vercel branch and environment setup

Connect the unified Vercel project to this GitHub repository and set its framework to **Services**. Keep `main` as the production branch. `dev` and other branches use Preview deployments. Configure environment variables for the Production and Preview targets, not a branch-specific override, so the corresponding Git branch selects the deployment while both targets share the intended credentials.

Set these server variables in both Production and Preview:

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `production` for deployed server processes |
| `PORT` | Express listen fallback; Vercel invokes the exported app |
| `MONGO_URI` | MongoDB Atlas URI with URL-encoded credentials |
| `JWT_SECRET` | At least 32 random characters for signed sessions |
| `SALT` | bcrypt cost factor from 4 through 15 |
| `INITIAL_ADMIN_SETUP_KEY` | Private gate required to bootstrap an empty production database; never expose as `VITE_*` |
| `FRONTEND_URL` | The same deployment origin used in email links and Stripe return URLs |
| `SENDER_EMAIL`, `SENDER_PASSWORD` | Required mail credentials and fallback sender identity |
| `NODEMAILER_SMTP_HOST`, `NODEMAILER_SMTP_PORT`, `NODEMAILER_SMTP_SECURE`, `NODEMAILER_SMTP_EMAIL`, `NODEMAILER_SMTP_PASSWORD` | Zoho SMTP connection and authentication; password is sensitive |
| `STRIPE_SECRET_KEY` | Server-only Stripe key; use the intended account and mode |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook endpoint connected to this deployment |
| `CRON_SECRET` | Sensitive bearer secret used by Vercel Cron on `/api/stocks/cron/check-alerts` |

Set these frontend variables in both targets:

| Variable | Purpose |
| --- | --- |
| `VITE_SERVER_URL` | Same-origin `/api` is recommended; Vite defaults to `/api` when omitted |
| `VITE_CLIENT_URL` | Frontend origin used by client-side links/configuration |

Vite-prefixed variables are included in the browser bundle. Never put database, SMTP, JWT, Stripe secret, webhook, or cron secrets in a `VITE_*` variable. This application uses Stripe-hosted Checkout, so it does not need a browser Stripe publishable key. After changing project variables, create a new deployment; existing deployments keep the values they were built with.

The `/setup` page is rate-limited and only works while the database has no admin. In production it is disabled unless `INITIAL_ADMIN_SETUP_KEY` is configured; the key is submitted over HTTPS and compared in constant time. A partial unique MongoDB index prevents concurrent requests from creating multiple bootstrap admins. The password must be at least 12 characters and within bcrypt's 72-byte input limit. Keep this key private and use a different value for each deployment environment.

In the current unified project, the configured public origins are `https://pizza-palette-app-mern.vercel.app` for production and `https://dev-pizza-palette-app-mern.vercel.app` for the `dev` preview. Keep `FRONTEND_URL` and `VITE_CLIENT_URL` aligned with the domain actually assigned to each target. `VITE_SERVER_URL=/api` avoids calls to a retired standalone backend hostname.

## Cron behavior

`vercel.json` registers the daily schedule `0 8 * * *` at `/api/stocks/cron/check-alerts`. The route is protected by `verifyCronSecret`, which compares Vercel's `Authorization: Bearer <CRON_SECRET>` header. Vercel Cron is for deployed production; Preview deployments do not act as the production schedule. For a long-running local or later VM process, `node-cron` invokes the same inventory-check logic, and it is disabled on Vercel serverless instances.

The scheduled controller emails alerts through Zoho SMTP. Verify `CRON_SECRET` exists in Vercel Production and that the latest deployment includes it before relying on the schedule. Vercel project variables take effect only in new deployments.

## Local development and Stripe test mode

Use the repository's declared package manager, pnpm (`pnpm@10.20.0`), with Node.js 24.x. Configure backend and frontend variables locally using the tracked example templates. For local browser calls, set `VITE_SERVER_URL=http://localhost:5000/api` and `VITE_CLIENT_URL=http://localhost:5173`.

Start the Express API and Vite UI in separate terminals using the package scripts. Ensure MongoDB is reachable before creating users, pizzas, or orders. The API's `/ready` endpoint reports whether the database connection completed.

For Stripe testing, use test-mode API credentials only and a webhook secret generated by the local listener:

```powershell
stripe login
stripe listen --forward-to http://localhost:5000/api/orders/stripe-webhook
```

Copy the listener's `whsec_...` into the local environment as `STRIPE_WEBHOOK_SECRET`; keep the test secret key in the server-only `STRIPE_SECRET_KEY`. In a second terminal, run `stripe trigger checkout.session.completed` and `stripe trigger checkout.session.expired` to deliver Stripe test fixtures to the listener. The completed fixture is useful for signature/transport verification, but its synthetic order ID does not represent a real order. Validate a real checkout with Stripe's test card against a non-production test database, and verify payment state changes from the webhook before considering payments end-to-end tested. Do not use live keys or production database inventory for a test.

## Deployment smoke checks

For each Production or Preview deployment, check:

1. Open the deployment root and a nested client route; both should render the Vite application.
2. Open `/api`; expect JSON identifying the Pizza Palette API.
3. Open `/health` and `/ready`; expect MongoDB connection details/status without credentials.
4. Request `/api/pizzas`; expect the standard API response and no `/undefined/...` URL.
5. Complete a Stripe test checkout in an isolated test database; verify the order is marked paid after its signed webhook.
6. Send a Stripe expiration fixture for a pending test order; verify inventory is restored once even if Stripe redelivers the event.
7. In production, confirm the Cron configuration and `CRON_SECRET` on a fresh deployment before retiring any previous hosting service.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `/api/...` renders the frontend | Confirm the root `vercel.json` is in the deployed commit, the project framework is Services, and the `/api` rewrites precede the frontend catch-all. |
| Frontend calls `/undefined/...` | Confirm `VITE_SERVER_URL` is set for the deployment or let Vite use its `/api` default, then build a new deployment. |
| API starts but database routes fail | Check `MONGO_URI` in the deployment's environment target, URL-encode special characters in the URI password, and inspect `/ready` plus runtime logs. |
| Login says credentials are invalid | Seeding is never automatic. Check `/api/admin/setup-status`; if no admin exists, either use `/setup` or explicitly run the production seed sync. The seed sync resets only the known sample account emails and matching sample records; change the committed sample passwords immediately after use. |
| Checkout session creation fails | Verify the server-only `STRIPE_SECRET_KEY` mode/account and inspect server logs; do not expose key values in browser variables. |
| Stripe rejects the webhook | The endpoint's `STRIPE_WEBHOOK_SECRET` must match the webhook sender. Local `stripe listen` uses a different signing secret than a Dashboard-registered endpoint. |
| Cron gets 401/500 | Confirm `CRON_SECRET` exists in Production and redeploy after changing it. Do not invoke the scheduled endpoint from a browser without its bearer token. |
| Email fails | Confirm Zoho SMTP host, port, secure mode, mailbox, and app password. The `NODEMAILER_SMTP_*` names take precedence over legacy `SMTP_*` values. |
| Browser request is blocked by CORS | Same-origin `/api` calls need no cross-origin permission. For a separately hosted frontend, add its exact origin to `ALLOWED_ORIGINS` and redeploy the backend. |
| Browser reports a manifest CORS error after a Vercel SSO redirect | The manifest is generated by `vite-plugin-pwa` as `/manifest.webmanifest`. Use the app's generated manifest link and check Vercel Deployment Protection for protected previews; a redirect to `vercel.com/sso-api` is an auth response, not an API CORS configuration issue. |

## Related documentation

- [Architecture and data flows](./ARCHITECTURE.md)
- [API reference](./API.md)
- [Stripe setup](./STRIPE_SETUP.md)
- [Local setup](./SETUP.md)
- [Testing](./TESTING.md)
- [Error handling](./ERROR_HANDLING.md)
