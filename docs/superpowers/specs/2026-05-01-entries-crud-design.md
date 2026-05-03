# Entries CRUD Design

## Goal

Issue 1.5 adds the universal wiki primitive for Chronicle Gaming Hub: Markdown entries that can be created, viewed, edited, and archived inside the active workspace.

## Scope

This slice adds a single `/app/entries` route and an entry edit route at `/app/entries/[entryId]`. Entries must belong to at least one real scope: a world, a campaign, or both. True unfiled draft/orphan entries are deferred until Chronicle has an explicit workspace draft area.

Out of scope for this issue:

- Nested hierarchy UI.
- Tags.
- Search.
- Player routes.
- Rich text editing.
- Library, ruleset, or homebrew containers.
- Public sharing or publishing.

## Data Model

Add an `entries` table with:

- `workspace_id` for ownership and RLS.
- Nullable `world_id` and `campaign_id`.
- A check that at least one of `world_id` or `campaign_id` is present.
- Foreign key constraints that keep worlds and campaigns inside the same workspace.
- A constraint that prevents a world/campaign mismatch when both are selected.
- Markdown body fields: `content_markdown` and `content_format`.
- Entry metadata: `type`, `visibility`, `custom_fields`, `sort_order`, `created_by`, timestamps, and `archived_at`.

Entries may belong to both a world and a campaign. Future library/rules/homebrew scopes should be added only when those containers exist and their permission model is clear.

## Application Flow

`/app/entries` lists non-archived entries for the active workspace. The create form lets the user pick a world, a campaign, or both, and enter title, summary, Markdown body, type, and visibility.

`/app/entries/[entryId]` shows and edits one entry. Saving updates the entry. Archiving sets `archived_at` and removes the entry from the normal list.

## Validation

Server actions validate:

- Title is 1 to 120 characters.
- Summary is at most 500 characters.
- Markdown body is at most 50,000 characters.
- Entry type is one of the documented initial types.
- Visibility is one of the documented initial visibility states.
- At least one scope is selected.
- Any selected world/campaign belongs to the active workspace.
- If both are selected, the campaign must belong to the selected world.

## Security

RLS is scoped through `private.user_is_workspace_member(workspace_id)`, matching worlds and campaigns. Player-facing filtering is not added yet, but `visibility` is stored now so future player routes can enforce it at query time.

No service-role keys, private API keys, or `.env` files are involved.

## Verification

Implementation should run:

- `npm.cmd run test`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- Supabase advisors after applying the migration.
