"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";
import { createWorldSlug } from "@/lib/worlds/slug";

function redirectWithError(message: string): never {
  redirect(`/app/worlds?error=${encodeURIComponent(message)}`);
}

export async function createWorld(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 1 || name.length > 80) {
    redirectWithError("World name must be between 1 and 80 characters.");
  }

  if (description.length > 400) {
    redirectWithError("World description must be 400 characters or fewer.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    redirect(getLoginPath("/app/worlds"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const { error: worldError } = await supabase.from("worlds").insert({
    created_by: userId,
    description,
    name,
    slug: createWorldSlug(name),
    workspace_id: workspace.id,
  });

  if (worldError) {
    redirectWithError("Could not create that world.");
  }

  revalidatePath("/app");
  revalidatePath("/app/worlds");
  redirect("/app/worlds");
}
