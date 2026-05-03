import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEntryTree,
  getEligibleParentOptions,
  isSameEntryScope,
} from "./hierarchy.ts";

const baseEntry = {
  campaignId: null,
  createdAt: "2026-05-02T10:00:00.000Z",
  parentId: null,
  sortOrder: 0,
  worldId: "world-1",
};

describe("buildEntryTree", () => {
  it("nests children under parents in stable sort order", () => {
    const tree = buildEntryTree([
      { ...baseEntry, id: "child-b", title: "Beta", parentId: "root" },
      { ...baseEntry, id: "root", title: "Root" },
      { ...baseEntry, id: "child-a", title: "Alpha", parentId: "root" },
      { ...baseEntry, id: "second-root", title: "Second", sortOrder: 1 },
    ]);

    assert.deepEqual(
      tree.map((entry) => ({
        id: entry.id,
        children: entry.children.map((child) => child.id),
      })),
      [
        { id: "root", children: ["child-a", "child-b"] },
        { id: "second-root", children: [] },
      ],
    );
  });
});

describe("isSameEntryScope", () => {
  it("requires matching world and campaign scope, including null values", () => {
    assert.equal(
      isSameEntryScope(
        { worldId: "world-1", campaignId: null },
        { worldId: "world-1", campaignId: null },
      ),
      true,
    );
    assert.equal(
      isSameEntryScope(
        { worldId: "world-1", campaignId: "campaign-1" },
        { worldId: "world-1", campaignId: null },
      ),
      false,
    );
  });
});

describe("getEligibleParentOptions", () => {
  it("filters to same-scope entries and excludes the current entry and descendants", () => {
    const options = getEligibleParentOptions(
      [
        { ...baseEntry, id: "current", title: "Current" },
        { ...baseEntry, id: "child", title: "Child", parentId: "current" },
        { ...baseEntry, id: "same-scope", title: "Same Scope" },
        {
          ...baseEntry,
          id: "campaign-scope",
          title: "Campaign Scope",
          campaignId: "campaign-1",
        },
      ],
      {
        campaignId: null,
        currentEntryId: "current",
        worldId: "world-1",
      },
    );

    assert.deepEqual(
      options.map((entry) => entry.id),
      ["same-scope"],
    );
  });
});
