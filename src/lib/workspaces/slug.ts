import { createSlug } from "@/lib/slugs";

export function createWorkspaceSlug(name: string) {
  return createSlug(name, "workspace");
}
