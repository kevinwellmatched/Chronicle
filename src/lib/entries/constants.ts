export const ENTRY_TYPES = [
  "page",
  "npc",
  "location",
  "faction",
  "quest",
  "session_note",
  "rule_reference",
  "handout",
  "scene",
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];

export const ENTRY_VISIBILITIES = [
  "private_gm",
  "player_visible",
  "revealed",
  "archived",
] as const;

export type EntryVisibility = (typeof ENTRY_VISIBILITIES)[number];

export const DEFAULT_ENTRY_TYPE: EntryType = "page";
export const DEFAULT_ENTRY_VISIBILITY: EntryVisibility = "private_gm";
