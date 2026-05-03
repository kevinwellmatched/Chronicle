alter table public.campaigns
add constraint campaigns_workspace_id_id_key unique (workspace_id, id);

alter table public.campaigns
add constraint campaigns_workspace_id_id_world_id_key unique (workspace_id, id, world_id);

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  world_id uuid references public.worlds(id) on delete restrict,
  campaign_id uuid references public.campaigns(id) on delete restrict,
  type text not null default 'page' check (type in ('page', 'npc', 'location', 'faction', 'quest', 'session_note', 'rule_reference', 'handout', 'scene')),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null default '' check (char_length(summary) <= 500),
  content_markdown text not null default '' check (char_length(content_markdown) <= 50000),
  content_format text not null default 'markdown' check (content_format = 'markdown'),
  visibility text not null default 'private_gm' check (visibility in ('private_gm', 'player_visible', 'revealed', 'archived')),
  custom_fields jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  constraint entries_has_scope check (world_id is not null or campaign_id is not null),
  constraint entries_world_workspace_match
    foreign key (workspace_id, world_id)
    references public.worlds (workspace_id, id)
    on delete restrict,
  constraint entries_campaign_workspace_match
    foreign key (workspace_id, campaign_id)
    references public.campaigns (workspace_id, id)
    on delete restrict,
  constraint entries_campaign_world_match
    foreign key (workspace_id, campaign_id, world_id)
    references public.campaigns (workspace_id, id, world_id)
    on delete restrict
);

create index entries_workspace_active_idx
  on public.entries (workspace_id, created_at desc)
  where archived_at is null;

create index entries_world_id_idx
  on public.entries (world_id);

create index entries_campaign_id_idx
  on public.entries (campaign_id);

create index entries_created_by_idx
  on public.entries (created_by);

create trigger entries_set_updated_at
before update on public.entries
for each row
execute function public.set_updated_at();

alter table public.entries enable row level security;

create policy "Workspace members can create entries"
on public.entries
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.user_is_workspace_member(workspace_id)
);

create policy "Workspace members can view entries"
on public.entries
for select
to authenticated
using (private.user_is_workspace_member(workspace_id));

create policy "Workspace members can update entries"
on public.entries
for update
to authenticated
using (private.user_is_workspace_member(workspace_id))
with check (private.user_is_workspace_member(workspace_id));
