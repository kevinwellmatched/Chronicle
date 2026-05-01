# Data Model

## Core Rule

Library content is reusable. World content is setting-specific. Campaign content is play-state-specific. Rules packages define mechanics. Schemas define builders. Permissions define visibility.

## Conceptual Entities

- **User:** Authenticated person using the app.
- **Workspace:** Top-level private container for library, worlds, campaigns, players, sources, and settings.
- **Library:** Reusable master vault of systems, sources, rules, content, adventures, settings, homebrew, and imported private material.
- **World:** Reusable setting/lore container that can exist independently from any campaign.
- **Campaign:** Active play instance using a world and selected content/rules.
- **Entry:** Universal wiki/database object for lore pages, NPCs, locations, factions, quests, rule references, session notes, scenes, and custom pages.
- **RulesPackage:** Modular rules layer for base rules, expansions, house rules, settings, and adventures.
- **BuilderSchema:** Future schema for characters, monsters, items, spells, or system-specific builders.
- **Asset:** Images, maps, handouts, PDFs, portraits, icons, or other files.
- **VisibilityRule:** Policy for GM-only, player-visible, revealed, selected-player, or future sharing behavior.
- **CloneForkRecord:** Provenance record for copied or forked content.

## MVP 0.1 Tables

### `profiles`

Supabase Auth profile extension.

Status: implemented in `20260501112958_workspace_foundation.sql`.

Fields:

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `created_at timestamptz`
- `updated_at timestamptz`

RLS:

- Signed-in users can select, insert, and update only their own profile.

### `workspaces`

Top-level private container.

Status: implemented in `20260501112958_workspace_foundation.sql`.

Fields:

- `id uuid primary key`
- `name text`
- `slug text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`

RLS:

- Signed-in users can create workspaces where `created_by` is their user ID.
- Signed-in users can select workspaces they created or belong to through `workspace_members`.
- Workspace owners can update workspaces.

### `workspace_members`

Membership table, even if MVP starts with one owner.

Status: implemented in `20260501112958_workspace_foundation.sql`.

Fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `user_id uuid references profiles(id)`
- `role text`
- `created_at timestamptz`

RLS:

- Signed-in users can select their own membership rows.
- Workspace creators can create their own initial `owner` membership.
- Initial owner membership creation uses a private helper function from `20260501120228_fix_workspace_member_insert_policy.sql` to avoid circular RLS checks between `workspaces` and `workspace_members`.

Initial roles:

- `owner`
- `member`

### `worlds`

Reusable setting/lore containers.

Status: implemented in `20260501190959_add_worlds.sql` and `20260501191148_add_worlds_created_by_index.sql`.

Fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `name text`
- `slug text`
- `description text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `archived_at timestamptz null`

RLS:

- Signed-in workspace members can create worlds in their active workspace.
- Signed-in workspace members can select worlds in workspaces they belong to.
- Signed-in workspace members can update worlds in workspaces they belong to.
- Policies use `private.user_is_workspace_member(workspace_id)` to avoid repeating workspace membership joins in every policy.

### `campaigns`

Active play instances linked to worlds.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `world_id uuid references worlds(id)`
- `name text`
- `slug text`
- `description text`
- `status text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `archived_at timestamptz null`

Initial statuses:

- `active`
- `paused`
- `archived`

### `entries`

Universal content primitive.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `world_id uuid references worlds(id) null`
- `campaign_id uuid references campaigns(id) null`
- `parent_id uuid references entries(id) null`
- `type text`
- `title text`
- `slug text`
- `summary text`
- `content_markdown text`
- `content_format text default 'markdown'`
- `custom_fields jsonb default '{}'::jsonb`
- `visibility text`
- `source_id uuid null`
- `sort_order integer default 0`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `archived_at timestamptz null`

Initial entry types:

- `page`
- `npc`
- `location`
- `faction`
- `quest`
- `session_note`
- `rule_reference`
- `handout`
- `scene`

Initial visibility states:

- `private_gm`
- `player_visible`
- `revealed`
- `archived`

### `tags`

Workspace-scoped tags.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `name text`
- `slug text`
- `color text null`
- `created_at timestamptz`
- `updated_at timestamptz`

### `entry_tags`

Entry/tag join table.

Suggested fields:

- `entry_id uuid references entries(id)`
- `tag_id uuid references tags(id)`
- `created_at timestamptz`

Primary key:

- `(entry_id, tag_id)`

### `entry_links`

Explicit internal links and backlinks.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `from_entry_id uuid references entries(id)`
- `to_entry_id uuid references entries(id)`
- `link_type text`
- `created_at timestamptz`

Initial link types:

- `mentions`
- `related`
- `source`

### `visibility_rules`

Future-ready table for sharing beyond simple entry visibility.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `entry_id uuid references entries(id) null`
- `subject_type text`
- `subject_id uuid null`
- `visibility text`
- `created_at timestamptz`
- `updated_at timestamptz`

Do not use this table to avoid simple MVP visibility. It exists to prevent cornering the model.

### `sessions`

Campaign session notes/logs.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `campaign_id uuid references campaigns(id)`
- `title text`
- `session_number integer null`
- `scheduled_for timestamptz null`
- `played_at timestamptz null`
- `notes_entry_id uuid references entries(id) null`
- `created_at timestamptz`
- `updated_at timestamptz`

### `assets`

Metadata for future files.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `world_id uuid references worlds(id) null`
- `campaign_id uuid references campaigns(id) null`
- `storage_path text`
- `asset_type text`
- `title text`
- `visibility text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`

### `clone_fork_records`

Provenance for copied/forked content.

Suggested fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `source_entity_type text`
- `source_entity_id uuid`
- `target_entity_type text`
- `target_entity_id uuid`
- `operation text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`

Initial operations:

- `clone`
- `fork`

## Future Tables

Do not implement these until the relevant phase:

- `systems`
- `sources`
- `rules_packages`
- `content_packages`
- `campaign_content`
- `maps`
- `map_objects`
- `characters`
- `character_sheets`
- `builder_schemas`
- `monsters`
- `items`
- `spells`
- `encounters`
- `import_jobs`
- `import_draft_entries`
- `player_notes`
- `handouts`

## Ownership Rules

- Every product record should belong to a `workspace_id`.
- Workspace access should be determined through `workspace_members`.
- MVP may create one workspace per user, but the schema should not prevent multiple workspaces later.
- `created_by` should point to the user who created the record.

## Visibility Model

MVP visibility is simple:

- `private_gm`: Only GM/owner/member roles with GM access can see it.
- `player_visible`: Safe to show to players when player routes exist.
- `revealed`: Explicitly discovered/shared in a campaign context.
- `archived`: Hidden from normal active views.

Player-facing routes are deferred, but all future queries must assume GM-only content can exist.

## Clone/Fork Model

Cloning copies content for independent use. Forking copies content while preserving provenance for future comparison or merge-like behavior.

MVP should record provenance only when clone/fork features are introduced. Do not build merge tooling early.

## Rules Package Model

Rules packages are modular containers for mechanics and content availability. They should eventually apply to worlds and campaigns.

For MVP 0.1, rules packages are planned only. Do not implement a rules engine or package dependency resolver.

## Library/World/Campaign Separation

- Library: reusable source and rules/content vault.
- World: reusable setting/lore source of truth.
- Campaign: play-state and current campaign-specific changes.

Example:

- World entry: Captain Veyra commands the East Gate.
- Campaign A state: Captain Veyra died in Session 12.
- Campaign B state: Captain Veyra is secretly the villain.

Campaign state must not casually overwrite reusable world lore.
