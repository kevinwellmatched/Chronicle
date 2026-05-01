create schema if not exists private;

create or replace function private.user_created_workspace(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspaces
    where workspaces.id = target_workspace_id
      and workspaces.created_by = auth.uid()
  );
$$;

revoke all on function private.user_created_workspace(uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.user_created_workspace(uuid) to authenticated;

drop policy "Workspace creators can create owner memberships"
on public.workspace_members;

create policy "Workspace creators can create owner memberships"
on public.workspace_members
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and role = 'owner'
  and private.user_created_workspace(workspace_id)
);
