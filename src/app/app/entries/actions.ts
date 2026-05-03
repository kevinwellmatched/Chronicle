"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { getEligibleParentOptions } from "@/lib/entries/hierarchy";
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
  parentId: string;
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
    parentId: String(formData.get("parentId") ?? "").trim(),
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

async function validateEntryParent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  input: EntryFormInput,
  currentEntryId?: string,
) {
  if (!input.parentId) {
    return null;
  }

  const { data, error } = await supabase
    .from("entries")
    .select("id, title, world_id, campaign_id, parent_id, sort_order, created_at")
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .neq("visibility", "archived")
    .returns<
      {
        id: string;
        title: string;
        world_id: string | null;
        campaign_id: string | null;
        parent_id: string | null;
        sort_order: number;
        created_at: string;
      }[]
    >();

  if (error || !data) {
    return "Could not validate the selected parent entry.";
  }

  const eligibleParents = getEligibleParentOptions(
    data.map((entry) => ({
      id: entry.id,
      title: entry.title,
      worldId: entry.world_id,
      campaignId: entry.campaign_id,
      parentId: entry.parent_id,
      sortOrder: entry.sort_order,
      createdAt: entry.created_at,
    })),
    {
      currentEntryId,
      worldId: input.worldId || null,
      campaignId: input.campaignId || null,
    },
  );

  if (!eligibleParents.some((entry) => entry.id === input.parentId)) {
    return "Choose an active parent entry in the same scope.";
  }

  return null;
}

async function validateChildScopes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  input: EntryFormInput,
  currentEntryId: string,
) {
  const { data, error } = await supabase
    .from("entries")
    .select("id, world_id, campaign_id")
    .eq("workspace_id", workspaceId)
    .eq("parent_id", currentEntryId)
    .is("archived_at", null)
    .neq("visibility", "archived")
    .returns<
      {
        id: string;
        world_id: string | null;
        campaign_id: string | null;
      }[]
    >();

  if (error || !data) {
    return "Could not validate child entries.";
  }

  const nextWorldId = input.worldId || null;
  const nextCampaignId = input.campaignId || null;
  const hasScopeMismatch = data.some(
    (entry) =>
      entry.world_id !== nextWorldId || entry.campaign_id !== nextCampaignId,
  );

  if (hasScopeMismatch) {
    return "Move or unparent child entries before changing this entry's scope.";
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

  const parentError = await validateEntryParent(supabase, workspace.id, input);

  if (parentError) {
    redirectWithListError(parentError);
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
      parent_id: input.parentId || null,
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

  const parentError = await validateEntryParent(
    supabase,
    workspace.id,
    input,
    entryId,
  );

  if (parentError) {
    redirectWithEntryError(entryId, parentError);
  }

  const childScopeError = await validateChildScopes(
    supabase,
    workspace.id,
    input,
    entryId,
  );

  if (childScopeError) {
    redirectWithEntryError(entryId, childScopeError);
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
      parent_id: input.parentId || null,
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
