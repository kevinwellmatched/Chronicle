export type EntryScope = {
  worldId: string | null;
  campaignId: string | null;
};

export type HierarchyEntry = EntryScope & {
  id: string;
  title: string;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
};

export type EntryTreeNode<TEntry extends HierarchyEntry> = TEntry & {
  children: EntryTreeNode<TEntry>[];
};

type ParentFilterOptions = EntryScope & {
  currentEntryId?: string | null;
};

export function isSameEntryScope(left: EntryScope, right: EntryScope) {
  return left.worldId === right.worldId && left.campaignId === right.campaignId;
}

export function buildEntryTree<TEntry extends HierarchyEntry>(
  entries: TEntry[],
): EntryTreeNode<TEntry>[] {
  const nodes = new Map<string, EntryTreeNode<TEntry>>();
  const roots: EntryTreeNode<TEntry>[] = [];

  getStableEntries(entries).forEach((entry) => {
    nodes.set(entry.id, {
      ...entry,
      children: [],
    });
  });

  nodes.forEach((node) => {
    if (node.parentId) {
      const parent = nodes.get(node.parentId);

      if (parent) {
        parent.children.push(node);
        return;
      }
    }

    roots.push(node);
  });

  sortTree(roots);

  return roots;
}

export function getEligibleParentOptions<TEntry extends HierarchyEntry>(
  entries: TEntry[],
  options: ParentFilterOptions,
) {
  const excludedIds = new Set<string>();

  if (options.currentEntryId) {
    excludedIds.add(options.currentEntryId);
    collectDescendantIds(entries, options.currentEntryId).forEach((id) => {
      excludedIds.add(id);
    });
  }

  return getStableEntries(entries).filter((entry) => {
    if (excludedIds.has(entry.id)) {
      return false;
    }

    return isSameEntryScope(entry, options);
  });
}

function collectDescendantIds<TEntry extends HierarchyEntry>(
  entries: TEntry[],
  parentId: string,
) {
  const childrenByParent = new Map<string, TEntry[]>();
  const descendants = new Set<string>();

  entries.forEach((entry) => {
    if (!entry.parentId) {
      return;
    }

    const siblings = childrenByParent.get(entry.parentId) ?? [];
    siblings.push(entry);
    childrenByParent.set(entry.parentId, siblings);
  });

  const visit = (id: string) => {
    (childrenByParent.get(id) ?? []).forEach((child) => {
      descendants.add(child.id);
      visit(child.id);
    });
  };

  visit(parentId);

  return descendants;
}

function sortTree<TEntry extends HierarchyEntry>(
  nodes: EntryTreeNode<TEntry>[],
) {
  nodes.sort(compareEntries);
  nodes.forEach((node) => {
    sortTree(node.children);
  });
}

function getStableEntries<TEntry extends HierarchyEntry>(entries: TEntry[]) {
  return [...entries].sort(compareEntries);
}

function compareEntries(left: HierarchyEntry, right: HierarchyEntry) {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  const titleComparison = left.title.localeCompare(right.title);

  if (titleComparison !== 0) {
    return titleComparison;
  }

  return left.createdAt.localeCompare(right.createdAt);
}
