import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

import { signOut } from "./actions";

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims) {
    redirect(getLoginPath("/app"));
  }

  const workspace = await getActiveWorkspace();

  if (!workspace) {
    redirect("/app/workspace");
  }

  const email = typeof claims.email === "string" ? claims.email : "Signed in";

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm text-zinc-500">
              Chronicle Gaming Hub
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white">
              {workspace.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Active workspace - {workspace.role}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/campaigns"
              className="border border-emerald-300/50 bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
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
              href="/app/workspace"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Workspace
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="grid flex-1 place-items-center py-16">
          <div className="w-full max-w-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              Phase 1
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
              Chronicle is scoped to your workspace.
            </h2>
            <p className="mt-4 leading-7 text-zinc-300">
              You are signed in as{" "}
              <span className="font-medium text-zinc-100">{email}</span>.
              World and campaign tools will use{" "}
              <span className="font-medium text-zinc-100">
                {workspace.name}
              </span>{" "}
              as their active workspace.
            </p>
            <Link
              href="/app/campaigns"
              className="mt-6 inline-flex border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
            >
              Open campaigns
            </Link>
            <Link
              href="/app/worlds"
              className="ml-3 mt-6 inline-flex border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Open worlds
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
