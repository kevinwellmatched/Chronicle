alter table public.entries
add column parent_id uuid references public.entries(id) on delete set null;

create index entries_parent_id_idx
  on public.entries (parent_id)
  where parent_id is not null;

create index entries_workspace_parent_idx
  on public.entries (workspace_id, parent_id, sort_order, title)
  where archived_at is null;

create or replace function private.validate_entry_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  parent_entry record;
  cycle_exists boolean;
begin
  if new.parent_id is null then
    return new;
  end if;

  if new.parent_id = new.id then
    raise exception 'Entry cannot be its own parent.';
  end if;

  select entries.id,
         entries.workspace_id,
         entries.world_id,
         entries.campaign_id,
         entries.archived_at
    into parent_entry
    from public.entries
   where entries.id = new.parent_id;

  if not found then
    return new;
  end if;

  if parent_entry.workspace_id <> new.workspace_id then
    raise exception 'Entry parent must be in the same workspace.';
  end if;

  if parent_entry.archived_at is not null then
    raise exception 'Entry parent must be active.';
  end if;

  if parent_entry.world_id is distinct from new.world_id
     or parent_entry.campaign_id is distinct from new.campaign_id then
    raise exception 'Entry parent must have the same world and campaign scope.';
  end if;

  with recursive ancestors as (
    select entries.id, entries.parent_id
      from public.entries
     where entries.id = new.parent_id
    union all
    select entries.id, entries.parent_id
      from public.entries
      join ancestors on entries.id = ancestors.parent_id
  )
  select exists (
    select 1
      from ancestors
     where ancestors.id = new.id
  )
    into cycle_exists;

  if cycle_exists then
    raise exception 'Entry hierarchy cannot contain cycles.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_entry_parent() from public;

create trigger entries_validate_parent
before insert or update of parent_id, workspace_id, world_id, campaign_id, archived_at
on public.entries
for each row
execute function private.validate_entry_parent();
