# CLAUDE.md

Guidance for AI coding agents (Claude Code, Cursor, etc.) working in this repository.

## Project

A full-stack MERN pizza delivery system: React (Vite) frontend, Express/MongoDB backend.

## Repo structure

This is a **pnpm workspace** orchestrated by **Turborepo** — not a plain npm project.

```
client/   React + Vite frontend (Tailwind CSS, PWA)
server/   Express + Mongoose backend
docs/     SETUP.md, DEPLOYMENT.md
```

- `pnpm-workspace.yaml` declares the workspace packages (`client`, `server`).
- `turbo.json` defines the task pipeline (`build`, `dev`, `lint`, `start`).
- Never run `npm install` in this repo — it will create a conflicting lockfile. Use `pnpm install` from the root.

## Common commands

Run from the repo root unless noted:

```bash
pnpm install               # install everything (client + server)
pnpm run dev               # run client + server dev servers in parallel (via turbo)
pnpm --filter client dev   # run just the frontend
pnpm --filter server dev   # run just the backend
pnpm run build              # build all packages (via turbo)
pnpm run lint                # lint all packages (via turbo)
pnpm run format               # prettier --write across the repo
pnpm run format:check          # prettier --check (CI-safe, no writes)
pnpm run data:import          # seed the database
pnpm run data:destroy         # wipe seeded data
```

Use `pnpm --filter <client|server> <script>` to scope any package.json script to one workspace package.

## Deployment

Deployed on Vercel as two separate projects (frontend + backend). See `docs/DEPLOYMENT.md`.

**Important:** `server/vercel.json`, `server/api/index.js`, and `server/public/` are load-bearing together — do not delete them. `turbo.json`'s mere presence makes Vercel treat this as a Turborepo monorepo, which changes its build detection for the backend from zero-config Express to a build-then-serve-static model. Those three files exist specifically to keep the backend deploying correctly under that model. If you touch backend deployment config, re-read that section of `docs/DEPLOYMENT.md` first.

## Conventions

- Backend is CommonJS (`require`/`module.exports`), not ESM.
- `dotenv.config()` calls must resolve `.env` relative to `__dirname`, not `process.cwd()` — the workspace task runner can invoke scripts from a different working directory than a plain `node` invocation would.
- Frontend uses design-system primitives under `client/src/components/ui/` (`Card`, `Input`, `Modal`, `Badge`, `Table`, etc.) — prefer composing these over ad-hoc markup/styles for new UI.
- Don't call `navigate()` (React Router) directly during render; it's a side effect and must be wrapped in `useEffect`.
- ESLint + Prettier are configured per-package (`client/.eslintrc.cjs`, `server/.eslintrc.cjs`) with `eslint-config-prettier` disabling stylistic rules Prettier already owns. Run `pnpm run lint` and `pnpm run format:check` before committing.

## Testing changes

There is no automated test suite for this project yet. Verify changes by running the app locally (`pnpm run dev`) and exercising the affected flow in a browser; for backend-only changes, `curl` the affected endpoint or use `server/index.js`'s `/health` and `/ready` endpoints to confirm the server boots and connects to MongoDB.
