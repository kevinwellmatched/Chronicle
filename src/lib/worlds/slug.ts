import { createSlug } from "@/lib/slugs";

export function createWorldSlug(name: string) {
  return createSlug(name, "world");
}
