# Health Checks and Login Troubleshooting

This guide describes the behavior implemented by the Express API and the unified Vercel deployment.

## Health endpoints

Successful endpoints use the API success envelope `{ success: true, data, message? }`. Failures use the standard error envelope with a machine-readable code, safe message, timestamp, request path, and request ID.

| Endpoint | Purpose | Database required? | Expected result |
| --- | --- | ---: | --- |
| `GET /health` | Liveness probe for the API process | No | HTTP 200 and current Mongo connection state |
| `GET /api/health` | Alias for liveness | No | Same response as `/health` |
| `GET /ready` | Readiness probe before database work | Yes | HTTP 200 when MongoDB is reachable; HTTP 503 with `SERVICE_UNAVAILABLE` otherwise |
| `GET /api/ready` | Alias for readiness | Yes | Same response as `/ready` |
| `GET /api` | API discovery response | No | HTTP 200 with health and readiness links |

The database middleware deliberately lets these probes reach their handlers. All other API requests await the shared Mongo connection before the route runs. The Vercel root rewrite table routes these paths to the backend before sending other paths to the Vite SPA.

## How login resolves an account

The client posts credentials to `POST /api/auth/login`. The server normalizes and validates the email, checks the customer collection, then checks the admin collection. A successful response identifies the account `type`; the client does not select an account type. Admin and manager logins also require approval.

## Why deployed login can report invalid credentials

The seed accounts are inserted only when someone explicitly runs an importer against a database; Vercel never runs the seeder automatically. Production seed/sync commands use the same sample accounts as local development. Their passwords are committed in `server/data/users.js`, so change them immediately after using a production seed and do not leave those credentials active on a public deployment.

Check a deployment safely:

1. Open `GET /ready`. If it returns 503, first correct the database environment value for that deployment and redeploy; login cannot work until the API can reach MongoDB.
2. Open `GET /api/admin/setup-status`. If it returns `needsSetup: true`, this database has no administrator. Visit `/setup` on the same deployment and create the first admin with a private, unique password. Production also requires `INITIAL_ADMIN_SETUP_KEY` to be configured and entered in the form.
3. If `needsSetup: false`, sign in with an account that was actually created in this database. The setup form is intentionally one-time. Later admin/manager accounts must be invited by an existing admin; customers use the registration flow.
4. If the account should exist, confirm the deployed database environment points to the intended MongoDB database, then use the password-reset flow. Do not run the sample data importer against production to work around an unknown password.

`GET /api/admin/setup-status` is read-only. `POST /api/admin/setup` succeeds only while no admin exists, validates the setup key when configured, and relies on a unique database index to prevent concurrent bootstrap accounts. Treat first-admin creation like any privileged account setup: use a private connection, choose a unique password, and keep credentials out of logs and documentation.

## If login still fails

- Confirm the browser uses the unified application domain and submits to `/api/auth/login`, not a retired standalone backend URL.
- Confirm the deployment targets the intended database. A successful connection can still point to an empty or different database.
- Verify that the exact account exists in that database and that a password reset completed there.
- Inspect runtime logs for the same deployment and request time. An API 401 indicates the account lookup/password check failed; 5xx or 503 points to runtime or database readiness instead.
