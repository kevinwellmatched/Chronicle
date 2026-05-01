"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { createWorkspaceSlug } from "@/lib/workspaces/slug";

function redirectWithError(message: string): never {
  redirect(`/app/workspace?error=${encodeURIComponent(message)}`);
}

export async function createWorkspace(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 1 || name.length > 80) {
    redirectWithError("Workspace name must be between 1 and 80 characters.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect(getLoginPath("/app/workspace"));
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { ignoreDuplicates: true, onConflict: "id" });

  if (profileError) {
    redirectWithError("Could not prepare your Chronicle profile.");
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      created_by: userId,
      name,
      slug: createWorkspaceSlug(name),
    })
    .select("id")
    .single<{ id: string }>();

  if (workspaceError || !workspace) {
    redirectWithError("Could not create that workspace.");
  }

  const { error: membershipError } = await supabase
    .from("workspace_members")
    .insert({
      role: "owner",
      user_id: userId,
      workspace_id: workspace.id,
    });

  if (membershipError) {
    redirectWithError(
      "Workspace was created, but membership could not be recorded.",
    );
  }

  revalidatePath("/app");
  revalidatePath("/app/workspace");
  redirect("/app");
}
