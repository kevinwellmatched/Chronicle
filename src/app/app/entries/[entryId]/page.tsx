import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import {
  ENTRY_TYPES,
  formatEntryType,
  formatEntryVisibility,
  getEditableVisibilities,
  getEntryForEdit,
  listEntryScopeOptions,
} from "@/lib/entries/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

import { archiveEntry, updateEntry } from "../actions";

type EntryPageProps = {
  params: Promise<{
    entryId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EntryPage({
  params,
  searchParams,
}: EntryPageProps) {
  const [{ entryId }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath(`/app/entries/${entryId}`));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const [entry, scopeOptions] = await Promise.all([
    getEntryForEdit(workspace.id, entryId),
    listEntryScopeOptions(workspace.id),
  ]);

  if (!entry) {
    notFound();
  }

  const updateEntryWithId = updateEntry.bind(null, entry.id);
  const archiveEntryWithId = archiveEntry.bind(null, entry.id);

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/app/entries"
              className="font-mono text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              Entries
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
              {entry.title}
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-300">
              {entry.scopeLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/entries"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              All entries
            </Link>
            <Link
              href="/app"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              App home
            </Link>
          </div>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <form action={updateEntryWithId} className="min-w-0 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-zinc-200">Title</span>
              <input
                required
                maxLength={120}
                name="title"
                defaultValue={entry.title}
                className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-zinc-200">Type</span>
                <select
                  required
                  name="type"
                  className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                  defaultValue={entry.type}
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
                  defaultValue={entry.visibility}
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
                <span className="text-sm font-medium text-zinc-200">World</span>
                <select
                  name="worldId"
                  className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                  defaultValue={entry.worldId ?? ""}
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
                  defaultValue={entry.campaignId ?? ""}
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
                defaultValue={entry.summary}
                className="mt-2 w-full resize-none border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-200">
                Markdown
              </span>
              <textarea
                maxLength={50000}
                name="contentMarkdown"
                rows={16}
                defaultValue={entry.contentMarkdown}
                className="mt-2 w-full resize-y border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
              />
            </label>

            <button
              type="submit"
              className="border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
            >
              Save entry
            </button>

            {query.error ? (
              <p className="border border-red-300/20 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
                {query.error}
              </p>
            ) : null}
          </form>

          <aside className="space-y-4">
            <div className="border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                {formatEntryType(entry.type)}
              </p>
              <p className="mt-4 text-sm leading-6 text-zinc-300">
                {formatEntryVisibility(entry.visibility)}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {entry.summary || "No summary yet."}
              </p>
            </div>

            <form action={archiveEntryWithId}>
              <button
                type="submit"
                className="w-full border border-red-300/30 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-300/50 hover:bg-red-300/10"
              >
                Archive entry
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
