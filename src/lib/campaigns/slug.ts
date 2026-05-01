import { createSlug } from "@/lib/slugs";

export function createCampaignSlug(name: string) {
  return createSlug(name, "campaign");
}
