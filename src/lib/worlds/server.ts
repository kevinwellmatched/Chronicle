import { createClient } from "@/lib/supabase/server";

export type WorldListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
};

export type WorldOption = {
  id: string;
  name: string;
};

type WorldRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export async function listActiveWorlds(
  workspaceId: string,
): Promise<WorldListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worlds")
    .select("id, name, slug, description, created_at")
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .returns<WorldRow[]>();

  if (error || !data) {
    return [];
  }

  return data.map((world) => ({
    id: world.id,
    name: world.name,
    slug: world.slug,
    description: world.description ?? "",
    createdAt: world.created_at,
  }));
}

export async function listWorldOptions(workspaceId: string): Promise<WorldOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("worlds")
    .select("id, name")
    .eq("workspace_id", workspaceId)
    .is("archived_at", null)
    .order("name", { ascending: true })
    .returns<WorldOption[]>();

  if (error || !data) {
    return [];
  }

  return data;
}
