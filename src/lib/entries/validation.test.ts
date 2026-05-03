import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ENTRY_TYPES,
  ENTRY_VISIBILITIES,
  validateEntryInput,
} from "./validation.ts";

describe("validateEntryInput", () => {
  it("requires an entry to belong to a world, campaign, or both", () => {
    const errors = validateEntryInput({
      contentMarkdown: "",
      summary: "",
      title: "Captain Veyra",
      type: "npc",
      visibility: "private_gm",
      worldId: "",
      campaignId: "",
    });

    assert.deepEqual(errors, ["Choose a world, a campaign, or both."]);
  });

  it("accepts entries scoped to both a world and a campaign", () => {
    const errors = validateEntryInput({
      contentMarkdown: "Known to guard the East Gate.",
      summary: "East Gate commander.",
      title: "Captain Veyra",
      type: "npc",
      visibility: "private_gm",
      worldId: "world-1",
      campaignId: "campaign-1",
    });

    assert.deepEqual(errors, []);
  });

  it("rejects unknown entry types and visibility states", () => {
    const errors = validateEntryInput({
      contentMarkdown: "",
      summary: "",
      title: "Odd Record",
      type: "monster",
      visibility: "public",
      worldId: "world-1",
      campaignId: "",
    });

    assert.deepEqual(errors, [
      `Entry type must be one of: ${ENTRY_TYPES.join(", ")}.`,
      `Visibility must be one of: ${ENTRY_VISIBILITIES.join(", ")}.`,
    ]);
  });

  it("enforces title, summary, and Markdown body length limits", () => {
    const errors = validateEntryInput({
      contentMarkdown: "x".repeat(50_001),
      summary: "x".repeat(501),
      title: "",
      type: "page",
      visibility: "private_gm",
      worldId: "world-1",
      campaignId: "",
    });

    assert.deepEqual(errors, [
      "Entry title must be between 1 and 120 characters.",
      "Entry summary must be 500 characters or fewer.",
      "Entry Markdown body must be 50,000 characters or fewer.",
    ]);
  });
});
