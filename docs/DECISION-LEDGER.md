# Decision Ledger

Durable decisions live here so agents do not rediscover or reverse them casually.

## DEC-0001: Canonical Project Name

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Use Chronicle Engine as the canonical project/platform name. Use Chronicle Gaming Hub as the working product/app title.
- **Reason:** The handoff used both names. Chronicle Engine is better for the repository and architecture layer, while Chronicle Gaming Hub remains suitable for the user-facing personal app.
- **Consequences:** Repository docs should use Chronicle Engine by default and mention Chronicle Gaming Hub when discussing the product experience.

## DEC-0002: Docs-Only First PR

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** The first PR should create the documentation spine and root agent instructions only.
- **Reason:** The repository is empty. A docs-only first PR locks the architectural boundaries before scaffold or product code exists.
- **Consequences:** No Next.js scaffold, migrations, or product features belong in the first PR.

## DEC-0003: Single App First

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Start with one Next.js application rather than a monorepo.
- **Reason:** This is a solo personal project. A monorepo would add coordination and tooling cost before the product needs it.
- **Consequences:** Shared logic should stay inside the app until there is a demonstrated need to split packages.

## DEC-0004: Supabase/PostgreSQL Source Of Truth

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Use Supabase Auth, PostgreSQL, Storage, and Row Level Security as the application foundation.
- **Reason:** The desired stack already points to Supabase, and PostgreSQL gives strong relational modeling for workspaces, entries, visibility, tags, links, and export.
- **Consequences:** All database changes must be committed as migrations. No dashboard-only schema changes.

## DEC-0005: Markdown-First Entry Content

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Store MVP entry bodies as Markdown first.
- **Reason:** Markdown is simple, export-friendly, easy to import later, and avoids early rich-text editor complexity.
- **Consequences:** Rich text JSON, Tiptap schemas, block editors, and dual-format sync are deferred.

## DEC-0006: Entries As Universal Primitive

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Use an `entries` table as the early primitive for lore pages, NPCs, locations, factions, quests, session notes, rules references, and similar content.
- **Reason:** This keeps early development flexible without creating many specialized tables prematurely.
- **Consequences:** Specialized content can start as entries with `type` and `custom_fields`. Separate tables should appear only when behavior or relational needs justify them.

## DEC-0007: Separate World Lore From Campaign State

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** World content is reusable setting truth. Campaign content is play-state for a specific campaign.
- **Reason:** A world NPC can have different states across campaigns. Mutating world lore for every campaign event would destroy reuse.
- **Consequences:** Campaign-specific notes/state should live in campaign-scoped entries or later overlay records.

## DEC-0008: Visibility From Day One

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Include simple visibility states in the MVP data model.
- **Reason:** GM/player separation is central to the product and becomes unsafe if added as a late UI-only layer.
- **Consequences:** Data access and RLS must respect visibility before player-facing routes ship.

## DEC-0009: Private Import Guardrails

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Future import workflows must treat user-provided copyrighted material as private user data and must not support DRM bypass, proprietary scraping, or public redistribution.
- **Reason:** The product is for private personal use and must avoid workflows designed to misuse copyrighted content.
- **Consequences:** Imported content should enter draft library content with source attribution and review before application to worlds or campaigns.

## DEC-0010: Supabase SSR Client Pattern

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Use `@supabase/ssr` with separate browser, server, and proxy helpers. Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Reason:** Supabase's current Next.js App Router guidance uses cookie-aware SSR clients and publishable keys. This keeps auth/session handling ready for future protected routes without adding auth UI in Issue 0.4.
- **Consequences:** Do not use deprecated auth-helper packages. Do not expose service-role or secret keys in client code. Keep environment lookup lazy so builds do not fail before `.env.local` is configured.

## DEC-0011: Migration-First Database Changes

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Track database schema work through committed Supabase migration files under `/supabase/migrations`.
- **Reason:** The project needs a repeatable database history that Codex, GitHub, Vercel, and Supabase can all inspect. Dashboard-only schema changes are too easy to lose or forget.
- **Consequences:** Future schema PRs must include migrations, update `/docs/DATA-MODEL.md`, and enable RLS on exposed tables before player-facing access exists.

## DEC-0012: Private Magic-Link Auth First

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Implement the first auth shell with Supabase email magic links, sign-in only, and `shouldCreateUser: false`.
- **Reason:** Chronicle is private personal-use software. Magic-link sign-in keeps the first Phase 1 PR small and avoids password reset, public signup, and account lifecycle scope.
- **Consequences:** Allowed users must be created or invited in Supabase Auth before they can sign in. The app must configure Supabase redirect URLs for local and deployed `/auth/confirm` callbacks.

## DEC-0013: Manual First Workspace

- **Date:** 2026-05-01
- **Status:** Accepted
- **Decision:** Let signed-in users manually create their first workspace instead of automatically creating one on login.
- **Reason:** The workspace name is user-facing and should be chosen intentionally. Manual creation also keeps the first workspace PR easy to review.
- **Consequences:** `/app` redirects signed-in users without a workspace to `/app/workspace`. Until a workspace switcher exists, the earliest membership is treated as the active workspace.
