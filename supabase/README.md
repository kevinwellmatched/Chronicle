# Supabase

This folder tracks database-related project files for Chronicle Engine.

## Current Status

- Supabase project: `Chronicle`
- Project ref: `tgvnpsaqkhmnxiledknv`
- Project URL: `https://tgvnpsaqkhmnxiledknv.supabase.co`
- Auth shell: private magic-link sign-in through `/login` and `/auth/confirm`
- Schema migrations: workspace, worlds, campaigns, and entries foundation
- Seed data: not started

## Auth Notes

- Email magic links are the first auth method.
- The app uses `signInWithOtp` with `shouldCreateUser: false`, so users must already exist in Supabase Auth.
- Add local and deployed `/auth/confirm` URLs to the Supabase Auth redirect allow list before testing sign-in links.
- If customizing email templates for SSR, include a token-hash link to `/auth/confirm` or use Supabase's auth-code redirect flow.

## Migration Rules

- All database schema changes must be represented as committed migration files.
- Do not rely on dashboard-only schema edits.
- Create migrations through the Supabase CLI when schema work begins.
- Keep migrations small, reviewable, and tied to one feature or schema slice.
- Document schema changes in `/docs/DATA-MODEL.md`.
- Record durable architecture decisions in `/docs/DECISION-LEDGER.md`.

## Security Rules

- Enable Row Level Security on every table in exposed schemas.
- Do not create public tables without explicit RLS policies.
- Do not place service-role or secret keys in client code.
- Use publishable keys for browser-safe Supabase clients.
- Treat imported/private TTRPG content as private user data.
- Player-facing queries must never expose GM-only content.

## Future Migration Sequence

The planned MVP migration order is:

1. Auth profile and workspace foundation:
   - `20260501112958_workspace_foundation.sql`
   - `20260501120228_fix_workspace_member_insert_policy.sql`
2. Worlds:
   - `20260501190959_add_worlds.sql`
   - `20260501191148_add_worlds_created_by_index.sql`
3. Campaigns:
   - `20260501193204_add_campaigns.sql`
   - `20260501193246_add_campaigns_world_workspace_index.sql`
4. Entries:
   - `20260501204856_add_entries.sql`
   - `20260501205442_add_entries_scope_indexes.sql`
5. Nested entry hierarchy.
6. Tags and entry tags.
7. Entry links and backlinks.
8. Sessions and campaign notes.
9. Export-supporting metadata and clone/fork records.
10. RLS policies for owner/member access and GM-only safety.

## Seed Data

`seed.sql` is currently a placeholder. Add seed data only when it helps test or demonstrate a feature.
