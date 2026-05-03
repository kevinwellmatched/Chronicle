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
  if new.parent_id is not null then
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

    if found then
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
  end if;

  if exists (
    select 1
      from public.entries children
     where children.parent_id = new.id
       and children.archived_at is null
       and (
         children.world_id is distinct from new.world_id
         or children.campaign_id is distinct from new.campaign_id
       )
  ) then
    raise exception 'Entry with active children cannot change world or campaign scope.';
  end if;

  return new;
end;
$$;

revoke all on function private.validate_entry_parent() from public;
