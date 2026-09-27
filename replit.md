# FindAble

FindAble helps Deaf people discover institutions with communication-access information before visiting.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Discovery remains public; authentication is introduced only for personalized actions such as saved places, reviews, and the account page.
- Browser sessions use the platform-managed OIDC flow with httpOnly database-backed sessions; FindAble does not collect or store passwords.
- Saved places and member reviews are scoped by the authenticated user ID in PostgreSQL, while fictional institution listings remain frontend demo data.

## Product

FindAble includes public search, category and accessibility filters, comparison, institution profiles, saved places, account profiles, member reviews, and local prototype contributions. Institution listings, verification states, ratings, and sample reviews are clearly marked as demo content.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
