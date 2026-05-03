import { createClient } from "@/lib/supabase/server";

import {
  ENTRY_TYPES,
  ENTRY_VISIBILITIES,
  type EntryType,
  type EntryVisibility,
} from "./constants";

export type EntryListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: EntryType;
  visibility: EntryVisibility;
  worldId: string | null;
  campaignId: string | null;
  worldName: string | null;
  campaignName: string | null;
  scopeLabel: string;
  createdAt: string;
};

export type EntryDetail = EntryListItem & {
  contentMarkdown: string;
};

export type EntryWorldOption = {
  id: string;
  name: string;
};

export type EntryCampaignOption = {
  id: string;
  name: string;
  worldId: string;
};

type EntryRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content_markdown?: string | null;
  type: EntryType;
  visibility: EntryVisibility;
  world_id: string | null;
  campaign_id: string | null;
  created_at: string;
};

type WorldNameRow = {
  id: string;
  name: string;
};

type CampaignNameRow = {
  id: string;
  name: string;
  world_id: string;
};

export function formatEntryType(type: EntryType) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatEntryVisibility(visibility: EntryVisibility) {
  return visibility
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getEditableVisibilities() {
  return ENTRY_VISIBILITIES.filter((visibility) => visibility !== "archived");
}

export async function listEntryScopeOptions(
  workspaceId: string,
): Promise<{
  worlds: EntryWorldOption[];
  campaigns: EntryCampaignOption[];
}> {
  const supabase = await createClient();
  const [worldsResult, campaignsResult] = await Promise.all([
    supabase
      .from("worlds")
      .select("id, name")
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .order("name", { ascending: true })
      .returns<WorldNameRow[]>(),
    supabase
      .from("campaigns")
      .select("id, name, world_id")
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .order("name", { ascending: true })
      .returns<CampaignNameRow[]>(),
  ]);

  return {
    worlds: worldsResult.data ?? [],
    campaigns:
      campaignsResult.data?.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        worldId: campaign.world_id,
      })) ?? [],
  };
}

export async function listActiveEntries(
  workspaceId: string,
): Promise<EntryListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, title, slug, summary, type, visibility, world_id, campaign_id, created_at",
    )
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .neq("visibility", "archived")
    .order("created_at", { ascending: false })
    .returns<EntryRow[]>();

  if (error || !data) {
    return [];
  }

  return hydrateEntryRows(workspaceId, data);
}

export async function getEntryForEdit(
  workspaceId: string,
  entryId: string,
): Promise<EntryDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, title, slug, summary, content_markdown, type, visibility, world_id, campaign_id, created_at",
    )
    .eq("workspace_id", workspaceId)
    .eq("id", entryId)
    .is("archived_at", null)
    .neq("visibility", "archived")
    .maybeSingle<EntryRow>();

  if (error || !data) {
    return null;
  }

  const [entry] = await hydrateEntryRows(workspaceId, [data]);

  return {
    ...entry,
    contentMarkdown: data.content_markdown ?? "",
  };
}

export { ENTRY_TYPES };

async function hydrateEntryRows(
  workspaceId: string,
  entries: EntryRow[],
): Promise<EntryListItem[]> {
  const supabase = await createClient();
  const worldIds = [
    ...new Set(
      entries
        .map((entry) => entry.world_id)
        .filter((worldId): worldId is string => Boolean(worldId)),
    ),
  ];
  const campaignIds = [
    ...new Set(
      entries
        .map((entry) => entry.campaign_id)
        .filter((campaignId): campaignId is string => Boolean(campaignId)),
    ),
  ];
  const worldNames = new Map<string, string>();
  const campaignNames = new Map<string, string>();

  if (worldIds.length > 0) {
    const { data: worlds } = await supabase
      .from("worlds")
      .select("id, name")
      .eq("workspace_id", workspaceId)
      .in("id", worldIds)
      .returns<WorldNameRow[]>();

    worlds?.forEach((world) => {
      worldNames.set(world.id, world.name);
    });
  }

  if (campaignIds.length > 0) {
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id, name, world_id")
      .eq("workspace_id", workspaceId)
      .in("id", campaignIds)
      .returns<CampaignNameRow[]>();

    campaigns?.forEach((campaign) => {
      campaignNames.set(campaign.id, campaign.name);
    });
  }

  return entries.map((entry) => {
    const worldName = entry.world_id
      ? (worldNames.get(entry.world_id) ?? "Unknown world")
      : null;
    const campaignName = entry.campaign_id
      ? (campaignNames.get(entry.campaign_id) ?? "Unknown campaign")
      : null;

    return {
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      summary: entry.summary ?? "",
      type: entry.type,
      visibility: entry.visibility,
      worldId: entry.world_id,
      campaignId: entry.campaign_id,
      worldName,
      campaignName,
      scopeLabel: formatEntryScopeLabel(worldName, campaignName),
      createdAt: entry.created_at,
    };
  });
}

function formatEntryScopeLabel(
  worldName: string | null,
  campaignName: string | null,
) {
  if (worldName && campaignName) {
    return `${worldName} + ${campaignName}`;
  }

  return worldName ?? campaignName ?? "Unscoped";
}
