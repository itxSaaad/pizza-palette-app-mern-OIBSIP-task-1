# Test Credentials

These accounts are created by `pnpm run data:import` (see `server/data/users.js` and `server/seeder.js`). They only exist in a local/development database seeded from this repo — they are not live accounts.

## Admins

| Email | Password | Role |
|---|---|---|
| `admin1@pizzapalette.com` | `Admin@123456` | Admin (Super Admin) |
| `admin2@pizzapalette.com` | `Manager@123456` | Manager |

Log in at `/login` — the unified login form resolves the account type automatically, no separate admin login page.

## Customers

| Email | Password | Verified? |
|---|---|---|
| `john@example.com` | `User@123456` | Yes |
| `jane@example.com` | `User@123456` | Yes |
| `test@example.com` | `User@123456` | No — useful for testing the email-verification flow |

## Notes

- Running `pnpm run data:import` prints this same table to the console after seeding.
- `pnpm run data:destroy` removes all seeded data.
- **Change these credentials before deploying anywhere real.** They are committed in plaintext in `server/data/users.js` specifically because they're meant only for local development and grading/review — never seed a production database with this file.
