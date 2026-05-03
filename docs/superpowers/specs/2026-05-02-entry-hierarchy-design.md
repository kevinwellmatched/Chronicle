# Entry Hierarchy Design

## Goal

Issue 1.6 adds a simple parent/child hierarchy to Chronicle entries so the flat wiki list can become a stable nested outline.

## Scope

This slice keeps the existing `/app/entries` and `/app/entries/[entryId]` routes. It adds `parent_id` to entries, lets users choose an entry parent in create/edit forms, and renders the entries list as a nested tree.

Out of scope:

- Drag-and-drop reordering.
- Multi-parent entries.
- Cross-scope parent/child links.
- Dedicated world/campaign detail routes.
- Tags, search, export, or player routes.

## Data Model

Add `parent_id uuid references entries(id) null` to `public.entries`.

Parent rules:

- A parent must be in the same workspace.
- A parent must have the same entry scope as the child: same `world_id` and same `campaign_id`, including null values.
- An entry cannot be its own parent.
- Parent updates cannot create cycles.
- Entries with active children cannot change world/campaign scope unless those children already match the new scope.
- Archiving a parent does not archive its children; archived entries stay hidden from the normal tree.

The same-scope and cycle rules should be enforced in the database with a trigger as well as in server-side form validation.

## UI Flow

`/app/entries` shows the active entries as a tree. Root entries are shown first; children are indented under their parent. Ordering is stable by `sort_order`, then title, then creation time.

The create form adds a parent selector. Because the app is server-rendered and intentionally simple, parent options can be shown with scope labels; the server rejects a parent that does not match the selected world/campaign scope.

The edit form adds the same parent selector, excluding the current entry and invalid descendants.

## Verification

Add pure tests for hierarchy ordering and parent-option filtering. Then run:

- `npm.cmd run test`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- Supabase advisors after applying the migration.
