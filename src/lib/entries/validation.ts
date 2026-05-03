export {
  ENTRY_TYPES,
  ENTRY_VISIBILITIES,
  type EntryType,
  type EntryVisibility,
} from "./constants.ts";

import { ENTRY_TYPES, ENTRY_VISIBILITIES } from "./constants.ts";

const entryTypeSet = new Set<string>(ENTRY_TYPES);
const entryVisibilitySet = new Set<string>(ENTRY_VISIBILITIES);

export type EntryInput = {
  title: string;
  summary: string;
  contentMarkdown: string;
  type: string;
  visibility: string;
  worldId: string;
  campaignId: string;
};

export function isEntryType(value: string) {
  return entryTypeSet.has(value);
}

export function isEntryVisibility(value: string) {
  return entryVisibilitySet.has(value);
}

export function validateEntryInput(input: EntryInput) {
  const errors: string[] = [];
  const title = input.title.trim();
  const summary = input.summary.trim();

  if (title.length < 1 || title.length > 120) {
    errors.push("Entry title must be between 1 and 120 characters.");
  }

  if (summary.length > 500) {
    errors.push("Entry summary must be 500 characters or fewer.");
  }

  if (input.contentMarkdown.length > 50_000) {
    errors.push("Entry Markdown body must be 50,000 characters or fewer.");
  }

  if (!isEntryType(input.type)) {
    errors.push(`Entry type must be one of: ${ENTRY_TYPES.join(", ")}.`);
  }

  if (!isEntryVisibility(input.visibility)) {
    errors.push(
      `Visibility must be one of: ${ENTRY_VISIBILITIES.join(", ")}.`,
    );
  }

  if (!input.worldId.trim() && !input.campaignId.trim()) {
    errors.push("Choose a world, a campaign, or both.");
  }

  return errors;
}
