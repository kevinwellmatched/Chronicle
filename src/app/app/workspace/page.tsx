import Link from "next/link";
import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { getActiveWorkspace } from "@/lib/workspaces/server";

import { createWorkspace } from "./actions";

type WorkspacePageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function WorkspacePage({
  searchParams,
}: WorkspacePageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect(getLoginPath("/app/workspace"));
  }

  const workspace = await getActiveWorkspace();

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-8">
        <header className="border-b border-white/10 pb-6">
          <Link
            href="/app"
            className="font-mono text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            Chronicle Gaming Hub
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white">
            Workspace
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-zinc-300">
            Your workspace is the private top-level container for worlds,
            campaigns, entries, and future libraries.
          </p>
        </header>

        <div className="grid flex-1 place-items-center py-16">
          {workspace ? (
            <div className="w-full border border-white/10 bg-white/[0.03] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                Active workspace
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
                {workspace.name}
              </h2>
              <p className="mt-4 leading-7 text-zinc-300">
                You are an {workspace.role} of this workspace. Chronicle will
                scope Phase 1 app queries through this membership.
              </p>
              <Link
                href="/app"
                className="mt-6 inline-flex border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
              >
                Return to app
              </Link>
            </div>
          ) : (
            <div className="w-full border border-white/10 bg-white/[0.03] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                First workspace
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
                Create your private Chronicle space.
              </h2>
              <p className="mt-4 leading-7 text-zinc-300">
                Start with one workspace. The model is ready for multiple
                workspaces later, but this first slice keeps the flow simple.
              </p>

              <form action={createWorkspace} className="mt-8 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">
                    Workspace name
                  </span>
                  <input
                    required
                    maxLength={80}
                    name="name"
                    className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                    placeholder="Kevin's Chronicle"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
                >
                  Create workspace
                </button>
              </form>

              {params.error ? (
                <p className="mt-5 border border-red-300/20 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
                  {params.error}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
