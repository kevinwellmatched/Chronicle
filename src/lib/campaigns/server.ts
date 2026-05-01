import { createClient } from "@/lib/supabase/server";

export type CampaignListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "paused" | "archived";
  worldName: string;
  createdAt: string;
};

type CampaignRow = {
  id: string;
  world_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "active" | "paused" | "archived";
  created_at: string;
};

type CampaignWorldRow = {
  id: string;
  name: string;
};

export async function listActiveCampaigns(
  workspaceId: string,
): Promise<CampaignListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, world_id, name, slug, description, status, created_at")
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .returns<CampaignRow[]>();

  if (error || !data) {
    return [];
  }

  const worldIds = [...new Set(data.map((campaign) => campaign.world_id))];
  const worldNames = new Map<string, string>();

  if (worldIds.length > 0) {
    const { data: worlds } = await supabase
      .from("worlds")
      .select("id, name")
      .eq("workspace_id", workspaceId)
      .in("id", worldIds)
      .returns<CampaignWorldRow[]>();

    worlds?.forEach((world) => {
      worldNames.set(world.id, world.name);
    });
  }

  return data.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    slug: campaign.slug,
    description: campaign.description ?? "",
    status: campaign.status,
    worldName: worldNames.get(campaign.world_id) ?? "Unknown world",
    createdAt: campaign.created_at,
  }));
}
