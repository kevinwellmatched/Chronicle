create index entries_workspace_world_idx
  on public.entries (workspace_id, world_id)
  where world_id is not null;

create index entries_workspace_campaign_idx
  on public.entries (workspace_id, campaign_id)
  where campaign_id is not null;

create index entries_workspace_campaign_world_idx
  on public.entries (workspace_id, campaign_id, world_id)
  where campaign_id is not null and world_id is not null;
