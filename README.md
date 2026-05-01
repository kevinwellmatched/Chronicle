# Chronicle Engine

Chronicle Engine is the private planning and codebase foundation for **Chronicle Gaming Hub**, a personal-use tabletop RPG operating system for worlds, campaigns, reusable content libraries, rules packages, builders, live GM tools, and player portals.

This repository is starting with a docs-only foundation. The first build target is **MVP 0.1: Private World/Campaign Wiki**.

## Product Direction

Chronicle Engine should grow from a useful private campaign/wiki tool into a modular TTRPG operating system. The architecture must keep these concepts separate:

- **Library content is reusable.**
- **World content is setting-specific.**
- **Campaign content is play-state-specific.**
- **Rules packages define mechanics.**
- **Schemas define builders.**
- **Permissions define visibility.**

The project is not a clone of any existing proprietary platform. Do not copy proprietary UI, branding, text, icons, trade dress, content, or implementation from LegendKeeper, D&D Beyond, World Anvil, Obsidian, Notion, Foundry, or any other product.

## MVP 0.1

MVP 0.1 is a private world/campaign wiki:

- Sign in
- Create a workspace
- Create a world
- Create a campaign linked to a world
- Create world entries
- Create campaign notes/state
- Tag entries
- Search entries
- Organize entries in a nested hierarchy
- Mark entries or fields as GM-only or player-visible
- Export basic content

Explicitly excluded from MVP 0.1:

- Character, monster, item, or spell builders
- Full rules engine
- PDF parsing or proprietary import workflows
- Advanced maps
- Live multiplayer
- Player portal
- Real-time collaboration
- Custom calendars
- Marketplace, public publishing, billing, or full VTT features

## Assumed Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or similar primitives
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security
- Vercel

## Documentation

Start here:

- [Project Index](docs/PROJECT-INDEX.md)
- [MVP Scope](docs/MVP-SCOPE.md)
- [Implementation Plan](docs/IMPLEMENTATION-PLAN.md)
- [Data Model](docs/DATA-MODEL.md)
- [Roadmap](docs/ROADMAP.md)
- [Decision Ledger](docs/DECISION-LEDGER.md)
- [Feature Registry](docs/FEATURE-REGISTRY.md)
- [Agent Runbook](docs/AGENT-RUNBOOK.md)
- [Agent Instructions](AGENTS.md)

## Development Principles

- Build in small, reviewable PRs.
- Prefer clear architecture over early feature volume.
- Keep the first useful vertical slices narrow.
- Use PostgreSQL/Supabase as the source of truth.
- Build export early so private content is portable.
- Use migrations for all database schema changes.
- Update documentation with behavior changes.
- Treat imported private TTRPG content as private user data.
