"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createCampaignSlug } from "@/lib/campaigns/slug";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

function redirectWithError(message: string): never {
  redirect(`/app/campaigns?error=${encodeURIComponent(message)}`);
}

export async function createCampaign(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const worldId = String(formData.get("worldId") ?? "").trim();

  if (name.length < 1 || name.length > 80) {
    redirectWithError("Campaign name must be between 1 and 80 characters.");
  }

  if (description.length > 400) {
    redirectWithError("Campaign description must be 400 characters or fewer.");
  }

  if (!worldId) {
    redirectWithError("Choose a world for this campaign.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect(getLoginPath("/app/campaigns"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const { data: world, error: worldError } = await supabase
    .from("worlds")
    .select("id")
    .eq("id", worldId)
    .eq("workspace_id", workspace.id)
    .is("archived_at", null)
    .maybeSingle<{ id: string }>();

  if (worldError || !world) {
    redirectWithError("Choose an active world in this workspace.");
  }

  const { error: campaignError } = await supabase.from("campaigns").insert({
    created_by: userId,
    description,
    name,
    slug: createCampaignSlug(name),
    status: "active",
    world_id: world.id,
    workspace_id: workspace.id,
  });

  if (campaignError) {
    if (campaignError.code === "23505") {
      redirectWithError("A campaign with that name already exists.");
    }

    redirectWithError("Could not create that campaign.");
  }

  revalidatePath("/app");
  revalidatePath("/app/campaigns");
  redirect("/app/campaigns");
}
