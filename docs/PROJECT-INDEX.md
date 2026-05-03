# Project Index

## Project Summary

Chronicle Engine is the codebase and architecture foundation for Chronicle Gaming Hub, a private personal-use tabletop RPG operating system. The long-term product combines a world/campaign wiki, reusable content library, modular rules packages, future schema-driven builders, live GM tools, and a player portal.

The project must stay legally and architecturally independent from proprietary TTRPG platforms. It may support user-provided private content later, but it must not include DRM bypass workflows, proprietary scraping, or public redistribution features.

## Current Phase

**Phase 1: Wiki Core**

Current repository state:

- Documentation spine
- Minimal Next.js app scaffold
- Supabase client configuration pattern
- Supabase migration folder and database convention
- Private Supabase Auth shell with magic-link sign-in, sign-out, and protected `/app`
- Workspace foundation with `profiles`, `workspaces`, and `workspace_members`
- World foundation with active-workspace world creation and listing
- Campaign foundation with active-workspace campaign creation and listing
- Entries foundation with active-workspace create/list/view/edit/archive flow

## Current App Capabilities

The app currently has a Chronicle-branded public shell, a private `/login` magic-link flow, a protected `/app` shell, manual first-workspace creation at `/app/workspace`, active-workspace world creation/listing at `/app/worlds`, campaign creation/listing at `/app/campaigns`, and Markdown entry CRUD at `/app/entries`.

## Major Directories

- `/docs`: Product, architecture, roadmap, and agent planning documents.
- `/src/app`: Next.js App Router routes.
- `/src/lib/auth`: Auth redirect helpers.
- `/src/lib/supabase`: Supabase browser, server, and proxy helpers.
- `/src/lib/workspaces`: Workspace query and slug helpers.
- `/src/lib/entries`: Entry constants, validation, slug, and query helpers.
- `/src/lib/env.ts`: Required environment variable accessors.
- `/supabase`: Supabase migration, seed, and database convention files.
- `/supabase/migrations`: Database migrations.
- Future `/public`: Static public assets.
- Future `/components`: Shared React components.
- Future `/lib`: Supabase clients, data access helpers, utilities, and server logic.
- Future `/types`: Shared TypeScript types.
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

- No tags, search, player-facing visibility enforcement, or export features.
- No deployment configuration.
- Auth is sign-in only. Allowed users must already exist in Supabase Auth.
- Only the first workspace is selected as active; workspace switching is deferred.

## Next Recommended Tasks

1. Add tags.
2. Add search, player-facing visibility enforcement, and export in small PRs.
