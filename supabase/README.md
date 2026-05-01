# Supabase

This folder tracks database-related project files for Chronicle Engine.

## Current Status

- Supabase project: `Chronicle`
- Project ref: `tgvnpsaqkhmnxiledknv`
- Project URL: `https://tgvnpsaqkhmnxiledknv.supabase.co`
- Schema migrations: not started
- Seed data: not started

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

1. Auth profile and workspace foundation.
2. Worlds and campaigns.
3. Entries with hierarchy, Markdown content, type, and visibility.
4. Tags and entry tags.
5. Entry links and backlinks.
6. Sessions and campaign notes.
7. Export-supporting metadata and clone/fork records.
8. RLS policies for owner/member access and GM-only safety.

## Seed Data

`seed.sql` is currently a placeholder. Add seed data only when it helps test or demonstrate a feature.

