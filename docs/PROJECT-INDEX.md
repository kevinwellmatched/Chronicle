# Project Index

## Project Summary

Chronicle Engine is the codebase and architecture foundation for Chronicle Gaming Hub, a private personal-use tabletop RPG operating system. The long-term product combines a world/campaign wiki, reusable content library, modular rules packages, future schema-driven builders, live GM tools, and a player portal.

The project must stay legally and architecturally independent from proprietary TTRPG platforms. It may support user-provided private content later, but it must not include DRM bypass workflows, proprietary scraping, or public redistribution features.

## Current Phase

**Phase 0: Foundation and Planning**

Current repository state:

- Docs-only project foundation
- No app scaffold yet
- No database migrations yet
- No runtime product features yet

## Current App Capabilities

None yet. The first product capability target is MVP 0.1: Private World/Campaign Wiki.

## Major Directories

- `/docs`: Product, architecture, roadmap, and agent planning documents.
- Future `/app`: Next.js App Router routes.
- Future `/components`: Shared React components.
- Future `/lib`: Supabase clients, data access helpers, utilities, and server logic.
- Future `/types`: Shared TypeScript types.
- Future `/supabase/migrations`: Database migrations.
- Future `/tests`: Unit, integration, or end-to-end tests.

## Important Files

- `/README.md`: Project overview and starting point.
- `/AGENTS.md`: Repository instructions for Codex and coding agents.
- `/docs/MVP-SCOPE.md`: MVP 0.1 boundaries.
- `/docs/DATA-MODEL.md`: Conceptual and database model.
- `/docs/IMPLEMENTATION-PLAN.md`: Phase 0 and Phase 1 build sequence.
- `/docs/DECISION-LEDGER.md`: Durable architecture decisions.

## Active Architectural Decisions

- Chronicle Engine is the canonical project/platform name.
- Chronicle Gaming Hub is the working product/app title.
- Start with a single Next.js app, not a monorepo.
- Use Supabase/PostgreSQL as the source of truth.
- Use Markdown as the first entry content format.
- Use entries as the universal early content primitive.
- Separate reusable world lore from campaign play-state.
- Design visibility early and enforce it in data access/RLS, not only in UI.
- Defer rules engines, builders, maps, imports, and player portal until the wiki foundation is stable.

## Current Known Limitations

- No scaffolded application.
- No authentication.
- No database schema.
- No migrations.
- No CI checks.
- No deployment configuration.

## Next Recommended Tasks

1. Initialize a minimal Next.js app with TypeScript and Tailwind.
2. Add lint, typecheck, build, and test command strategy.
3. Add Supabase client configuration pattern without committing secrets.
4. Create initial Supabase migration folder.
5. Implement auth shell and workspace foundation.
6. Add worlds, campaigns, entries, hierarchy, tags, search, visibility, and export in small PRs.
