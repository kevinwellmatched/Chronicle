import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { listActiveCampaigns } from "@/lib/campaigns/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";
import { listWorldOptions } from "@/lib/worlds/server";

import { createCampaign } from "./actions";

type CampaignsPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function CampaignsPage({
  searchParams,
}: CampaignsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath("/app/campaigns"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const [campaigns, worlds] = await Promise.all([
    listActiveCampaigns(workspace.id),
    listWorldOptions(workspace.id),
  ]);

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
              Campaigns
            </h1>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-300">
              Active play instances linked to reusable worlds.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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

        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="min-w-0">
            {campaigns.length > 0 ? (
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <article
                    key={campaign.id}
                    className="border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                          {campaign.status}
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-normal text-white">
                          {campaign.name}
                        </h2>
                      </div>
                      <p className="border border-white/10 px-3 py-1 text-sm text-zinc-300">
                        {campaign.worldName}
                      </p>
                    </div>
                    <p className="mt-3 leading-7 text-zinc-300">
                      {campaign.description || "No description yet."}
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
                  Create your first campaign.
                </h2>
                <p className="mt-4 leading-7 text-zinc-300">
                  Campaigns track active play against a reusable world. Campaign
                  notes and state arrive in later slices.
                </p>
              </div>
            )}
          </section>

          <aside className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              New campaign
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-white">
              Link play to a world
            </h2>

            {worlds.length > 0 ? (
              <form action={createCampaign} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    Name
                  </span>
                  <input
                    required
                    maxLength={80}
                    name="name"
                    className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                    placeholder="Embers Below"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    World
                  </span>
                  <select
                    required
                    name="worldId"
                    className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-emerald-300"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a world
                    </option>
                    {worlds.map((world) => (
                      <option key={world.id} value={world.id}>
                        {world.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="A short note about the campaign."
                  />
                </label>

                <button
                  type="submit"
                  className="w-full border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
                >
                  Create campaign
                </button>
              </form>
            ) : (
              <div className="mt-6 border border-white/10 bg-black/20 p-4">
                <p className="text-sm leading-6 text-zinc-300">
                  Create a world before adding a campaign.
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
