# Roadmap

## Phase 0: Foundation And Planning

Goal: create the repository foundation, documentation spine, basic architecture decisions, and app skeleton plan.

Deliverables:

- Root `AGENTS.md`
- Project documentation spine
- Initial architecture summary
- Initial MVP scope
- Initial data model draft
- Initial implementation plan
- Next.js scaffold plan
- Supabase migration plan

## Phase 1: Wiki Core

Goal: build the useful private world/campaign wiki foundation.

Deliverables:

- Supabase Auth: implemented with private magic-link sign-in
- Workspace model: implemented with manual first-workspace creation
- Create/list worlds: implemented for active workspace
- Create/list campaigns linked to worlds: implemented for active workspace
- Create/edit/archive entries
- Nested entry hierarchy
- Markdown editor/viewer
- Tags
- Basic PostgreSQL search
- Entry types and simple templates
- Simple visibility states
- Basic Markdown/JSON export

## Phase 2: Library Core

Goal: create the reusable personal content vault.

Deliverables:

- Systems
- Sources
- Library entries
- Source attribution
- Browse/filter library content by system, source, type, and tag
- Private/open/homebrew/imported content flags
- Clone/fork library content

## Phase 3: World/Campaign Relationship

Goal: separate reusable world lore from campaign play-state.

Deliverables:

- Campaign-specific state entries or overlays
- Campaign content applications
- Campaign session log
- Campaign quests
- Campaign NPC state
- Campaign timeline basics

## Phase 4: Visibility And Player Preview

Goal: add reliable GM/player separation before exposing player-facing routes.

Deliverables:

- Permission-safe queries
- Strong RLS policies
- GM-only and player-visible entry/field handling
- Revealed/unrevealed status
- Player preview mode

## Phase 5: Atlas/Map Foundation

Goal: add simple image-backed maps.

Deliverables:

- Upload map image
- View map
- Add pins
- Link pins to entries
- Pin visibility
- Basic map sidebar
- World/campaign map assignment

Deferred:

- Regions
- Paths
- Fog of war
- Distance measurement
- Nested maps
- Zoom-based labels

## Phase 6: Import/Export Foundation

Goal: make private content portable and safely reviewable.

Deliverables:

- Export entries as Markdown
- Export workspace/world/campaign as JSON
- Import Markdown as draft entries
- Import review queue
- Source attribution on import
- Basic duplicate detection

Deferred:

- PDF parsing
- Proprietary website import
- DRM bypass workflows
- Public redistribution

## Phase 7: Rules Package Foundation

Goal: represent modular rules/content packages without a full rules engine.

Deliverables:

- Create rules packages
- Assign systems
- Assign dependencies
- Add entries to packages
- Apply packages to worlds/campaigns
- Campaign-approved content list

## Phase 8: Builder Foundation

Goal: prototype schema-driven builders only after library, packages, and permissions exist.

Deliverables:

- Builder schema data model
- Simple character sheet schema
- Minimal custom-system character builder prototype
- Derived field prototype
- Validation prototype

## Phase 9: Live GM Mode

Goal: create a session-running dashboard separate from wiki mode.

Deliverables:

- Start session
- Current scene
- Party roster
- Active NPCs
- Active quests
- Scene notes
- GM notes
- Quick rules links
- Session log
- Recap draft
- Reveal content from GM mode

## Phase 10: Player Portal

Goal: player-facing campaign access with strict visibility controls.

Deliverables:

- Player login/access
- Campaign dashboard
- Character view
- Revealed lore
- Player-safe maps
- Handouts
- Quests
- Session recaps
- Permission-safe routing
