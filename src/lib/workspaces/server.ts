import { createClient } from "@/lib/supabase/server";

type WorkspaceMembershipRow = {
  workspace_id: string;
  role: "owner" | "member";
};

export type ActiveWorkspace = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "member";
};

export async function getActiveWorkspace(): Promise<ActiveWorkspace | null> {
  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<WorkspaceMembershipRow>();

  if (membershipError || !membership) {
    return null;
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .eq("id", membership.workspace_id)
    .single<{ id: string; name: string; slug: string }>();

  if (workspaceError || !workspace) {
    return null;
  }

  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    role: membership.role,
  };
}
