# MVP Scope

## MVP 0.1: Private World/Campaign Wiki

MVP 0.1 proves the product foundation: a private, export-friendly wiki that separates reusable world lore from campaign play-state and includes visibility from the beginning.

## Required

- User can sign in.
- User can create a workspace.
- User can create a world.
- User can create a campaign linked to a world.
- User can create entries inside a world.
- User can create campaign notes/state inside a campaign.
- User can tag entries.
- User can search entries.
- User can organize entries in a nested hierarchy.
- User can mark entries or fields as GM-only or player-visible.
- User can export basic content.

## Explicitly Excluded

- D&D Beyond-level character builders
- Monster, item, spell, or power builders
- Full rules engine
- PDF parsing
- D&D Beyond import
- Proprietary website import
- Advanced map tools
- Live multiplayer
- Player portal
- Real-time collaboration
- Custom calendars
- Marketplace
- Public publishing
- Billing
- Full VTT features

## MVP Product Principles

- Use entries as the universal content primitive.
- Keep editing Markdown-first.
- Use PostgreSQL/Supabase as the source of truth.
- Add export early so content is portable.
- Keep world lore and campaign play-state separate.
- Treat visibility as a data/security concern, not just UI decoration.
- Prefer simple, boring, usable screens over complex dashboards.

## Acceptance Criteria

MVP 0.1 is complete when a signed-in user can:

- Create and enter a workspace.
- Create a world.
- Create a campaign attached to that world.
- Add nested Markdown entries to the world.
- Add campaign-specific notes without overwriting world lore.
- Tag entries and filter/search them.
- Mark content with simple visibility states.
- Export entries as Markdown and structured JSON.

## Non-Goals

MVP 0.1 does not need to support multiple players, live sessions, rules automation, maps, imports, system-specific character sheets, or real-time collaboration.
