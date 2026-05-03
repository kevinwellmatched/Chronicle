# Entries CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Markdown-first entries CRUD for active-workspace worlds and campaigns.

**Architecture:** Add one database table with workspace-scoped RLS, one small validation module, server query helpers, `/app/entries` for list/create, and `/app/entries/[entryId]` for view/edit/archive. Keep this slice scoped to entries only; hierarchy, tags, search, and library/rules containers remain deferred.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, Supabase/PostgreSQL, Node built-in test runner.

---

## File Map

- Create `supabase/migrations/20260501204856_add_entries.sql` for the entries schema, constraints, indexes, trigger, and RLS policies.
- Create `src/lib/entries/constants.ts` for entry type and visibility constants.
- Create `src/lib/entries/validation.ts` for pure validation used by server actions.
- Create `src/lib/entries/validation.test.ts` for Node test-runner coverage.
- Create `src/lib/entries/slug.ts` for entry slugs.
- Create `src/lib/entries/server.ts` for entry list/detail helpers and scope option loading.
- Create `src/app/app/entries/page.tsx` for list and create.
- Create `src/app/app/entries/actions.ts` for create/update/archive actions.
- Create `src/app/app/entries/[entryId]/page.tsx` for the edit/detail view.
- Modify `src/app/app/page.tsx` to link to entries.
- Modify docs in `docs/DATA-MODEL.md`, `docs/FEATURE-REGISTRY.md`, `docs/PROJECT-INDEX.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/ROADMAP.md`, and `supabase/README.md`.
- Modify `package.json` to add `npm run test` using Node's built-in test runner.

## Tasks

- [ ] Add failing validation tests for scope, enum, and length rules.
- [ ] Implement entry constants and validation.
- [ ] Add the entries migration with RLS and same-workspace constraints.
- [ ] Add entry query helpers and slug creation.
- [ ] Build `/app/entries` list/create flow.
- [ ] Build `/app/entries/[entryId]` view/edit/archive flow.
- [ ] Add navigation and update docs.
- [ ] Run test, lint, typecheck, build, and Supabase advisors.
