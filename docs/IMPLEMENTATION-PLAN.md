# Implementation Plan

## Summary

Build Chronicle Engine incrementally. The first PR is docs-only. The next PR should add the smallest useful app scaffold. Phase 1 then builds the private world/campaign wiki as a sequence of small vertical slices.

## Initial Route Structure

Planned routes:

- `/`: landing or redirect shell
- `/login`: authentication screen
- `/app`: authenticated app home
- `/app/workspace`: workspace settings/selection
- `/app/worlds`: world list
- `/app/worlds/[worldId]`: world overview
- `/app/worlds/[worldId]/entries/[entryId]`: world entry view/edit
- `/app/campaigns`: campaign list
- `/app/campaigns/[campaignId]`: campaign overview
- `/app/campaigns/[campaignId]/notes/[entryId]`: campaign note/state entry
- `/app/search`: workspace search
- `/app/export`: export surface

## Initial Component Structure

Planned component groups:

- App shell and navigation
- Workspace switcher placeholder
- World and campaign list views
- Entry tree/sidebar
- Markdown editor/viewer
- Tag picker
- Visibility selector
- Search results
- Empty, loading, and error states
- Export action surface

## Initial Supabase Migration Sequence

1. Auth profile and workspace foundation.
2. Worlds and campaigns.
3. Entries with hierarchy, Markdown content, type, and visibility.
4. Tags and entry tags.
5. Entry links and backlinks.
6. Sessions and campaign notes.
7. Export-supporting metadata and clone/fork records.
8. RLS policies for owner/member access and GM-only safety.

## Phase 0 Backlog

### Issue 0.1: Create docs spine and root agent instructions

Goal: establish repository guidance before code exists.

Deliverables:

- `README.md`
- `AGENTS.md`
- `/docs/PROJECT-INDEX.md`
- `/docs/DECISION-LEDGER.md`
- `/docs/FEATURE-REGISTRY.md`
- `/docs/ROADMAP.md`
- `/docs/DATA-MODEL.md`
- `/docs/AGENT-RUNBOOK.md`
- `/docs/MVP-SCOPE.md`
- `/docs/IMPLEMENTATION-PLAN.md`

### Issue 0.2: Initialize minimal Next.js app

Goal: create a minimal app foundation.

Status: implemented in the `codex/initialize-next-app` branch.

Scope:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Dark-theme-friendly base styling
- No product features beyond a shell

### Issue 0.3: Add project checks

Goal: establish basic verification commands.

Scope:

- `npm run lint`
- `npm run typecheck`
- `npm run test` if tests are introduced
- `npm run build`

### Issue 0.4: Add Supabase configuration pattern

Goal: prepare auth/database integration safely.

Status: implemented in the `codex/supabase-config-pattern` branch.

Scope:

- Supabase browser/server client setup
- Environment variable examples without secrets
- No service-role key in client code

### Issue 0.5: Add migration folder and database convention

Goal: make schema changes trackable from the start.

Status: implemented in the `codex/supabase-migration-convention` branch.

Scope:

- `supabase/migrations`
- Optional `supabase/seed.sql`
- Documentation for migration expectations

## Phase 1 Backlog

### Issue 1.1: Add Supabase Auth shell

Goal: allow sign-in/sign-out using Supabase Auth.

Status: implemented with private email magic-link sign-in.

Acceptance criteria:

- User can sign in.
- User can sign out.
- Protected routes redirect unauthenticated users.
- No secrets are exposed.

Notes:

- Uses Supabase passwordless email auth via `signInWithOtp`.
- Uses `shouldCreateUser: false`; users must be allowed in Supabase Auth before they can sign in.
- Adds `/login`, `/auth/confirm`, and protected `/app`.
- The `/auth/confirm` callback accepts Supabase auth-code redirects and token-hash verification links.

### Issue 1.2: Add workspace model

Goal: create the user's first private workspace.

Status: implemented with manual first-workspace creation.

Acceptance criteria:

- Signed-in user can create a workspace.
- Workspace membership is recorded.
- App queries are scoped to the active workspace.

Notes:

- Adds the first schema migration for `profiles`, `workspaces`, and `workspace_members`.
- Enables RLS on all three tables.
- Uses a private RLS helper for initial owner membership creation to avoid circular policy checks.
- Uses the earliest membership as the active workspace until a workspace switcher exists.
- Adds `/app/workspace`; `/app` redirects there until a workspace exists.

### Issue 1.3: Add worlds

Goal: create and list reusable setting containers.

Status: implemented with active-workspace world creation and listing.

Acceptance criteria:

- User can create a world.
- User can list worlds in the workspace.
- Archived worlds are excluded from default views.

Notes:

- Adds the `worlds` table with RLS scoped through workspace membership.
- Adds `/app/worlds` for creating and listing non-archived worlds.
- World detail pages, campaigns, and entries remain deferred to later issues.

### Issue 1.4: Add campaigns linked to worlds

Goal: create active play instances from worlds.

Status: implemented with active-workspace campaign creation and listing.

Acceptance criteria:

- User can create a campaign linked to a world.
- User can list campaigns.
- Campaigns do not mutate world lore by default.

Notes:

- Adds the `campaigns` table with RLS scoped through workspace membership.
- Adds `/app/campaigns` for creating and listing non-archived campaigns.
- Campaign creation requires an active non-archived world in the current workspace.
- Campaign detail pages, campaign notes, and play-state entries remain deferred.

### Issue 1.5: Add entries CRUD

Goal: create the universal wiki primitive.

Status: implemented with active-workspace Markdown entry creation, editing, and archiving.

Acceptance criteria:

- User can create, view, edit, and archive entries.
- Entries can belong to a world, campaign, or both.
- Entry bodies use Markdown.
- Entry type and visibility are stored.

Notes:

- Adds the `entries` table with RLS scoped through workspace membership.
- Adds `/app/entries` for listing and creating non-archived entries.
- Adds `/app/entries/[entryId]` for viewing, editing, and archiving an entry.
- Entries must belong to at least one real scope; unfiled/orphan drafts are deferred.

### Issue 1.6: Add nested entry hierarchy

Goal: organize entries into parent/child trees.

Status: implemented with same-scope parent selection and a stable nested entries list.

Acceptance criteria:

- User can set an entry parent.
- Entry tree renders in a stable order.
- Moving an entry does not change its content.

Notes:

- Adds `parent_id` to `entries`.
- Parent entries must be active, in the same workspace, and in the same world/campaign scope.
- A database trigger rejects self-parenting and parent cycles.
- Drag-and-drop ordering remains deferred.

### Issue 1.7: Add tags

Goal: label and browse entries.

Acceptance criteria:

- User can create tags.
- User can assign tags to entries.
- User can filter by tag.

### Issue 1.8: Add basic search

Goal: find wiki content quickly.

Acceptance criteria:

- User can search entry title, summary, and Markdown content.
- Search is scoped to the active workspace.
- Archived entries are excluded by default.

### Issue 1.9: Add visibility states

Goal: make GM/player content separation explicit.

Acceptance criteria:

- Entries support `private_gm`, `player_visible`, `revealed`, and `archived`.
- UI shows the current visibility.
- Data access is designed so future player routes cannot see GM-only content.

### Issue 1.10: Add basic export

Goal: keep private content portable.

Acceptance criteria:

- User can export entries as Markdown.
- User can export structured JSON backup.
- Export preserves hierarchy, tags, visibility, and campaign/world scope.

## Architectural Risks

- World lore and campaign state may blur if campaign changes edit world entries directly.
- A universal rules engine could consume the project before the wiki is useful.
- Visibility could become unsafe if implemented only in UI.
- Imported private content could become mixed with open/shareable content without source and ownership metadata.
- Too many specialized tables could slow iteration before entry patterns are proven.

## Scope Traps To Avoid

- Character builders before library/rules/campaign availability exists.
- PDF parsing or proprietary import workflows.
- Advanced maps before wiki/search/navigation are useful.
- Live multiplayer or real-time collaboration.
- Public publishing, marketplace, billing, or full VTT features.
- UI polish that delays fast entry creation, search, hierarchy, visibility, and export.
