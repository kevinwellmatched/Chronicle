import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";
import { listActiveWorlds } from "@/lib/worlds/server";

import { createWorld } from "./actions";

type WorldsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function WorldsPage({ searchParams }: WorldsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath("/app/worlds"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const worlds = await listActiveWorlds(workspace.id);

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/app"
              className="font-mono text-sm text-zinc-500 transition hover:text-zinc-300"
            >
              {workspace.name}
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white">
              Worlds
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-300">
              Reusable setting containers for lore, places, factions, and
              campaign-ready material.
            </p>
          </div>

          <Link
            href="/app"
            className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            App home
          </Link>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="min-w-0">
            {worlds.length > 0 ? (
              <div className="grid gap-4">
                {worlds.map((world) => (
                  <article
                    key={world.id}
                    className="border border-white/10 bg-white/[0.03] p-5"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                      World
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-normal text-white">
                      {world.name}
                    </h2>
                    <p className="mt-3 leading-7 text-zinc-300">
                      {world.description || "No description yet."}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-white/[0.03] p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Empty
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
                  Create your first world.
                </h2>
                <p className="mt-4 leading-7 text-zinc-300">
                  Worlds are reusable setting containers. Campaigns and entries
                  will connect to them in later Phase 1 slices.
                </p>
              </div>
            )}
          </section>

          <aside className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              New world
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-white">
              Add a setting container
            </h2>

            <form action={createWorld} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-200">Name</span>
                <input
                  required
                  maxLength={80}
                  name="name"
                  className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                  placeholder="The Ashen Coast"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-200">
                  Description
                </span>
                <textarea
                  maxLength={400}
                  name="description"
                  rows={5}
                  className="mt-2 w-full resize-none border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                  placeholder="A short note about the world."
                />
              </label>

              <button
                type="submit"
                className="w-full border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                Create world
              </button>
            </form>

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
