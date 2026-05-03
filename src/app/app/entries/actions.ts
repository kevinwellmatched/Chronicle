"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createEntrySlug } from "@/lib/entries/slug";
import {
  isEntryType,
  isEntryVisibility,
  validateEntryInput,
} from "@/lib/entries/validation";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

type WorldScopeRow = {
  id: string;
};

type CampaignScopeRow = {
  id: string;
  world_id: string;
};

type EntryFormInput = {
  title: string;
  summary: string;
  contentMarkdown: string;
  type: string;
  visibility: string;
  worldId: string;
  campaignId: string;
};

function redirectWithListError(message: string): never {
  redirect(`/app/entries?error=${encodeURIComponent(message)}`);
}

function redirectWithEntryError(entryId: string, message: string): never {
  redirect(`/app/entries/${entryId}?error=${encodeURIComponent(message)}`);
}

function parseEntryFormData(formData: FormData): EntryFormInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    contentMarkdown: String(formData.get("contentMarkdown") ?? ""),
    type: String(formData.get("type") ?? "").trim(),
    visibility: String(formData.get("visibility") ?? "").trim(),
    worldId: String(formData.get("worldId") ?? "").trim(),
    campaignId: String(formData.get("campaignId") ?? "").trim(),
  };
}

async function getCurrentUserAndWorkspace(returnTo: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect(getLoginPath(returnTo));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  return {
    supabase,
    userId,
    workspace,
  };
}

async function validateEntryScope(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  input: EntryFormInput,
) {
  let world: WorldScopeRow | null = null;
  let campaign: CampaignScopeRow | null = null;

  if (input.worldId) {
    const { data, error } = await supabase
      .from("worlds")
      .select("id")
      .eq("id", input.worldId)
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .maybeSingle<WorldScopeRow>();

    if (error || !data) {
      return "Choose an active world in this workspace.";
    }

    world = data;
  }

  if (input.campaignId) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, world_id")
      .eq("id", input.campaignId)
      .eq("workspace_id", workspaceId)
      .is("archived_at", null)
      .maybeSingle<CampaignScopeRow>();

    if (error || !data) {
      return "Choose an active campaign in this workspace.";
    }

    campaign = data;
  }

  if (world && campaign && campaign.world_id !== world.id) {
    return "The selected campaign must belong to the selected world.";
  }

  return null;
}

export async function createEntry(formData: FormData) {
  const input = parseEntryFormData(formData);
  const validationErrors = validateEntryInput(input);

  if (validationErrors.length > 0) {
    redirectWithListError(validationErrors[0]);
  }

  if (!isEntryType(input.type) || !isEntryVisibility(input.visibility)) {
    redirectWithListError("Choose a valid entry type and visibility.");
  }

  if (input.visibility === "archived") {
    redirectWithListError("Use the archive action to archive an entry.");
  }

  const { supabase, userId, workspace } =
    await getCurrentUserAndWorkspace("/app/entries");
  const scopeError = await validateEntryScope(supabase, workspace.id, input);

  if (scopeError) {
    redirectWithListError(scopeError);
  }

  const { data: entry, error } = await supabase
    .from("entries")
    .insert({
      content_format: "markdown",
      content_markdown: input.contentMarkdown,
      created_by: userId,
      summary: input.summary,
      slug: createEntrySlug(input.title),
      title: input.title,
      type: input.type,
      visibility: input.visibility,
      world_id: input.worldId || null,
      campaign_id: input.campaignId || null,
      workspace_id: workspace.id,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !entry) {
    redirectWithListError("Could not create that entry.");
  }

  revalidatePath("/app");
  revalidatePath("/app/entries");
  redirect(`/app/entries/${entry.id}`);
}

export async function updateEntry(entryId: string, formData: FormData) {
  const input = parseEntryFormData(formData);
  const validationErrors = validateEntryInput(input);

  if (validationErrors.length > 0) {
    redirectWithEntryError(entryId, validationErrors[0]);
  }

  if (!isEntryType(input.type) || !isEntryVisibility(input.visibility)) {
    redirectWithEntryError(entryId, "Choose a valid entry type and visibility.");
  }

  if (input.visibility === "archived") {
    redirectWithEntryError(entryId, "Use the archive action to archive an entry.");
  }

  const { supabase, workspace } = await getCurrentUserAndWorkspace(
    `/app/entries/${entryId}`,
  );
  const scopeError = await validateEntryScope(supabase, workspace.id, input);

  if (scopeError) {
    redirectWithEntryError(entryId, scopeError);
  }

  const { error } = await supabase
    .from("entries")
    .update({
      content_markdown: input.contentMarkdown,
      summary: input.summary,
      slug: createEntrySlug(input.title),
      title: input.title,
      type: input.type,
      visibility: input.visibility,
      world_id: input.worldId || null,
      campaign_id: input.campaignId || null,
    })
    .eq("id", entryId)
    .eq("workspace_id", workspace.id);

  if (error) {
    redirectWithEntryError(entryId, "Could not save that entry.");
  }

  revalidatePath("/app/entries");
  revalidatePath(`/app/entries/${entryId}`);
  redirect(`/app/entries/${entryId}`);
}

export async function archiveEntry(entryId: string) {
  const { supabase, workspace } = await getCurrentUserAndWorkspace(
    `/app/entries/${entryId}`,
  );

  const { error } = await supabase
    .from("entries")
    .update({
      archived_at: new Date().toISOString(),
      visibility: "archived",
    })
    .eq("id", entryId)
    .eq("workspace_id", workspace.id);

  if (error) {
    redirectWithEntryError(entryId, "Could not archive that entry.");
  }

  revalidatePath("/app");
  revalidatePath("/app/entries");
  redirect("/app/entries");
}
