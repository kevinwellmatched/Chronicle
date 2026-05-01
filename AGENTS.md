# AGENTS.md

## Project Identity

This project is Chronicle Engine, a private personal-use TTRPG operating system for worlds, campaigns, rules libraries, builders, live GM tools, and player portals.

Chronicle Gaming Hub is the working product/app title.

It is not a clone of any existing proprietary platform.

Do not copy proprietary UI, branding, icons, text, content, trade dress, workflows, or implementation from existing products.

## Development Style

- Make small, reviewable changes.
- Prefer simple implementation over clever abstraction.
- Do not introduce new libraries without explaining why.
- Do not rewrite working systems unless the task explicitly asks for it.
- Preserve existing behavior unless the ticket says otherwise.
- Build incrementally.
- Avoid premature abstraction.
- Avoid implementing future-phase systems before the foundation exists.

## Current Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Vercel

## Required Checks

Before finishing a task, run the available checks, such as:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

If one of these commands does not exist yet, either create it where appropriate or clearly explain that it is not available.

## Database Rules

- All schema changes must be represented as migrations.
- Do not rely on untracked dashboard-only database changes.
- Do not place service-role keys in client code.
- Respect Row Level Security.
- Add seed data only when it helps test or demonstrate the feature.
- Document schema changes in `/docs/DATA-MODEL.md`.

## Security Rules

- Never expose secrets.
- Never commit `.env` files.
- Never place private API keys in frontend code.
- Treat imported private TTRPG content as private user data.
- Do not build public redistribution flows for copyrighted content.
- Player-facing routes must never expose GM-only content.

## UI Rules

- Keep the UI clean, readable, and dark-theme friendly.
- Favor usability over decorative complexity.
- Do not clone any proprietary app's UI.
- Build boring, usable screens before fancy interactions.

## Git Rules

- Work on feature branches.
- Do not commit directly to `main` or `master` unless explicitly instructed.
- Keep pull requests small.
- Include a summary, testing notes, and screenshots when UI changes.

## Documentation Rules

When changing behavior, update the relevant docs:

- `/docs/PROJECT-INDEX.md`
- `/docs/FEATURE-REGISTRY.md`
- `/docs/DATA-MODEL.md`
- `/docs/ROADMAP.md`
- `/docs/DECISION-LEDGER.md` if a durable decision was made

## Review Guidelines

When reviewing code, look for:

- Security regressions
- Auth/permission mistakes
- GM-only content leaks
- Missing RLS or unsafe database access
- Missing migrations
- Overly broad abstractions
- Premature future-phase implementation
- Broken TypeScript types
- UI flows without loading/error/empty states
- Docs not updated after behavior changes
