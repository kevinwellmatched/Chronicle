import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import {
  ENTRY_TYPES,
  formatEntryType,
  formatEntryVisibility,
  getEditableVisibilities,
  listActiveEntries,
  listEntryScopeOptions,
} from "@/lib/entries/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

import { createEntry } from "./actions";

type EntriesPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EntriesPage({ searchParams }: EntriesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath("/app/entries"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const [entries, scopeOptions] = await Promise.all([
    listActiveEntries(workspace.id),
    listEntryScopeOptions(workspace.id),
  ]);
  const hasScopes =
    scopeOptions.worlds.length > 0 || scopeOptions.campaigns.length > 0;

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/app"
              className="font-mono text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              {workspace.name}
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
              Entries
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-300">
              Markdown notes, lore, scenes, and references scoped to worlds and
              campaigns.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/campaigns"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Campaigns
            </Link>
            <Link
              href="/app/worlds"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Worlds
            </Link>
            <Link
              href="/app"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              App home
            </Link>
          </div>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="min-w-0">
            {entries.length > 0 ? (
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/app/entries/${entry.id}`}
                    className="border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                          {formatEntryType(entry.type)}
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-normal text-white">
                          {entry.title}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="border border-white/10 px-3 py-1 text-sm text-zinc-300">
                          {formatEntryVisibility(entry.visibility)}
                        </span>
                        <span className="border border-white/10 px-3 py-1 text-sm text-zinc-300">
                          {entry.scopeLabel}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 leading-7 text-zinc-300">
                      {entry.summary || "No summary yet."}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Empty
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
                  Create your first entry.
                </h2>
                <p className="mt-4 leading-7 text-zinc-300">
                  Entries are the first wiki primitive for lore, NPCs, session
                  notes, handouts, and other campaign material.
                </p>
              </div>
            )}
          </section>

          <aside className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              New entry
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-white">
              Add Markdown content
            </h2>

            {hasScopes ? (
              <form action={createEntry} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    Title
                  </span>
                  <input
                    required
                    maxLength={120}
                    name="title"
                    className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                    placeholder="Captain Veyra"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-zinc-200">
                      Type
                    </span>
                    <select
                      required
                      name="type"
                      className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                      defaultValue="page"
                    >
                      {ENTRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {formatEntryType(type)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-zinc-200">
                      Visibility
                    </span>
                    <select
                      required
                      name="visibility"
                      className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                      defaultValue="private_gm"
                    >
                      {getEditableVisibilities().map((visibility) => (
                        <option key={visibility} value={visibility}>
                          {formatEntryVisibility(visibility)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-zinc-200">
                      World
                    </span>
                    <select
                      name="worldId"
                      className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                      defaultValue=""
                    >
                      <option value="">No world</option>
                      {scopeOptions.worlds.map((world) => (
                        <option key={world.id} value={world.id}>
                          {world.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-zinc-200">
                      Campaign
                    </span>
                    <select
                      name="campaignId"
                      className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                      defaultValue=""
                    >
                      <option value="">No campaign</option>
                      {scopeOptions.campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    Summary
                  </span>
                  <textarea
                    maxLength={500}
                    name="summary"
                    rows={3}
                    className="mt-2 w-full resize-none border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                    placeholder="A short note for lists and search later."
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    Markdown
                  </span>
                  <textarea
                    maxLength={50000}
                    name="contentMarkdown"
                    rows={8}
                    className="mt-2 w-full resize-y border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                    placeholder="Write notes in Markdown."
                  />
                </label>

                <button
                  type="submit"
                  className="w-full border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
                >
                  Create entry
                </button>
              </form>
            ) : (
              <div className="mt-6 border border-white/10 bg-black/20 p-4">
                <p className="text-sm leading-6 text-zinc-300">
                  Create a world or campaign before adding entries.
                </p>
                <Link
                  href="/app/worlds"
                  className="mt-4 inline-flex border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
                >
                  Open worlds
                </Link>
              </div>
            )}

            {params.error ? (
              <p className="mt-5 border border-red-300/20 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
                {params.error}
              </p>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}
