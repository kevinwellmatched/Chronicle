# Entry Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a simple same-scope parent/child tree for active-workspace entries.

**Architecture:** Add `parent_id` and a database trigger for parent safety, then keep hierarchy rendering in pure TypeScript helpers. Reuse the existing entries routes and server actions, adding parent selection to create/edit forms.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, Supabase/PostgreSQL, Node built-in test runner.

---

## File Map

- Create `supabase/migrations/20260503031854_add_entry_hierarchy.sql` for `parent_id`, indexes, and trigger-based parent validation.
- Create `supabase/migrations/20260503032331_harden_entry_hierarchy_scope.sql` for child-scope hardening.
- Create `src/lib/entries/hierarchy.ts` for tree building, same-scope checks, descendant detection, and parent option filtering.
- Create `src/lib/entries/hierarchy.test.ts` for pure hierarchy behavior tests.
- Modify `src/lib/entries/server.ts` to fetch `parent_id` and `sort_order`, return tree items, and expose parent options.
- Modify `src/app/app/entries/actions.ts` to parse and validate `parentId` on create/update.
- Modify `src/app/app/entries/page.tsx` to render the nested tree and add parent selection to create.
- Modify `src/app/app/entries/[entryId]/page.tsx` to add parent selection to edit.
- Update docs in `docs/DATA-MODEL.md`, `docs/FEATURE-REGISTRY.md`, `docs/PROJECT-INDEX.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/ROADMAP.md`, and `supabase/README.md`.

## Tasks

- [ ] Write failing hierarchy tests for stable tree order and parent option filtering.
- [ ] Implement hierarchy helpers.
- [ ] Add hierarchy migration and apply it to Supabase.
- [ ] Wire server helpers and actions to load/save `parent_id`.
- [ ] Update list/create/edit UI.
- [ ] Update docs.
- [ ] Run local checks and Supabase advisors.
