import { createSlug } from "@/lib/slugs";

export function createEntrySlug(title: string) {
  return createSlug(title, "entry");
}
