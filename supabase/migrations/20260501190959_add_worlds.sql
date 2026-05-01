create or replace function private.user_is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_members.workspace_id = target_workspace_id
      and workspace_members.user_id = auth.uid()
  );
$$;

revoke all on function private.user_is_workspace_member(uuid) from public;
grant execute on function private.user_is_workspace_member(uuid) to authenticated;

create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz,
  unique (workspace_id, slug)
);

create index worlds_workspace_active_idx
  on public.worlds (workspace_id, created_at desc)
  where archived_at is null;

create trigger worlds_set_updated_at
before update on public.worlds
for each row
execute function public.set_updated_at();

alter table public.worlds enable row level security;

create policy "Workspace members can create worlds"
on public.worlds
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.user_is_workspace_member(workspace_id)
);

create policy "Workspace members can view worlds"
on public.worlds
for select
to authenticated
using (private.user_is_workspace_member(workspace_id));

create policy "Workspace members can update worlds"
on public.worlds
for update
to authenticated
using (private.user_is_workspace_member(workspace_id))
with check (private.user_is_workspace_member(workspace_id));
