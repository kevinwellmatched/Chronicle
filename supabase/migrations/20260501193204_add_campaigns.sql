alter table public.worlds
add constraint worlds_workspace_id_id_key unique (workspace_id, id);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  world_id uuid not null references public.worlds(id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  unique (workspace_id, slug),
  constraint campaigns_world_workspace_match
    foreign key (workspace_id, world_id)
    references public.worlds (workspace_id, id)
    on delete restrict
);

create index campaigns_workspace_active_idx
  on public.campaigns (workspace_id, created_at desc)
  where archived_at is null;

create index campaigns_world_id_idx
  on public.campaigns (world_id);

create index campaigns_created_by_idx
  on public.campaigns (created_by);

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

alter table public.campaigns enable row level security;

create policy "Workspace members can create campaigns"
on public.campaigns
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.user_is_workspace_member(workspace_id)
);

create policy "Workspace members can view campaigns"
on public.campaigns
for select
to authenticated
using (private.user_is_workspace_member(workspace_id));

create policy "Workspace members can update campaigns"
on public.campaigns
for update
to authenticated
using (private.user_is_workspace_member(workspace_id))
with check (private.user_is_workspace_member(workspace_id));
