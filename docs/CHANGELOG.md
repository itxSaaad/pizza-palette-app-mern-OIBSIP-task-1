# Changelog

Notable changes to Pizza Palette, reconstructed from the repo's merged pull request history. Dates are merge dates.

## 2026-08-05

- **Auth redesign**: single unified login entry point for customers and admin/manager accounts (`/api/auth/login` resolves the account type automatically); admin/manager accounts are now invite-only instead of open self-registration; one-time first-admin bootstrap flow; admin approval is now re-checked on every request, not just at login.
- **Aggregation-pipeline cleanup**: consolidated duplicate low-stock reporting logic onto a single MongoDB aggregation (`analyticsUtils.getLowStockAlert`); fixed a route-ordering bug that made `/api/stocks/check-alerts` and `/api/stocks/low-stock` unreachable.
- **Shared-component refactor**: extracted 7 reusable components/hooks (`AdminListLayout`, `GroupedTableSection`, `usePagination`/`Pagination`, `useModalTransition`, `useFormState`, `Loader` `fullWidth` variant, `Table` `columnRenderers`) from duplicated admin-dashboard UI code.
- **pnpm/Turborepo monorepo migration**: converted to a pnpm workspace with Turborepo task orchestration; fixed a Vercel deployment issue where Turborepo detection broke zero-config Express backend deploys; added AI-agent tooling (`CLAUDE.md`, Cursor rules, ESLint for the backend, repo-wide Prettier).
- **Bug fixes**: Stripe checkout inventory rollback on session-creation failure, webhook idempotency, pricing rounding (integer-cents accumulation), a dead pizza `size` query filter, SMTP config parsing.

## 2026-08-03 — 2026-07-17

- **Design-system redesign** (multiple phases): rebuilt the public site, user flows (auth, profile, orders, cart, checkout), and the full admin dashboard onto a shared set of design-system primitives (`Card`, `Input`, `Modal`, `Badge`, restyled `Button`/`Message`/`Loader`).

## 2026-02-22 (in progress)

- **Payments**: migrated from Razorpay to Stripe Checkout (hosted, redirect-based) with webhook-based payment confirmation.
- **Custom pizza sizing**: pizza size moved from the `Pizza` document to the order line-item level, with server-side price recomputation (`pricingUtils.calculateOrderPricing`) so client-supplied prices/totals are never trusted.
- **Inventory safeguards**: availability checks and deduction/rollback around order creation; low-stock alert emails to approved admins.
- **Analytics layer**: admin analytics endpoints backed by MongoDB aggregation pipelines (order stats, popular pizzas, inventory usage, user analytics, daily revenue).
- **Hardening**: standardized `ApiError`/`ApiResponse` error handling, request validation via `express-validator`, rate limiting, Helmet CSP, MongoDB connection caching, `/health`/`/ready` endpoints, boot-time env validation.
- **Security fix**: password-reset bypass (an unset reset token/expiry pair could satisfy the reset check) fixed.

---

For the exact commit-level history, see `git log` or the repository's [pull request history](https://github.com/itxSaaad/pizza-palette-app-mern-OIBSIP-task-1/pulls?q=is%3Apr+is%3Amerged).
