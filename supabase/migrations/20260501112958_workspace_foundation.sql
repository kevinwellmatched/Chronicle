create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (created_by, slug)
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (workspace_id, user_id)
);

create index workspace_members_user_id_idx
  on public.workspace_members (user_id);

create index workspace_members_workspace_id_idx
  on public.workspace_members (workspace_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Workspace creators can create workspaces"
on public.workspaces
for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy "Workspace members can view workspaces"
on public.workspaces
for select
to authenticated
using (
  created_by = (select auth.uid())
  or exists (
    select 1
    from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = (select auth.uid())
  )
);

create policy "Workspace owners can update workspaces"
on public.workspaces
for update
to authenticated
using (
  exists (
    select 1
    from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = (select auth.uid())
      and workspace_members.role = 'owner'
  )
)
with check (
  exists (
    select 1
    from public.workspace_members
    where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = (select auth.uid())
      and workspace_members.role = 'owner'
  )
);

create policy "Users can view their own workspace memberships"
on public.workspace_members
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Workspace creators can create owner memberships"
on public.workspace_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and exists (
    select 1
    from public.workspaces
    where workspaces.id = workspace_members.workspace_id
      and workspaces.created_by = (select auth.uid())
  )
);
