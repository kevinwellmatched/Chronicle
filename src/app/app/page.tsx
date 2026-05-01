import { redirect } from "next/navigation";

import { getLoginPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

import { signOut } from "./actions";

export default async function AppHomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims) {
    redirect(getLoginPath("/app"));
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
              App shell
            </h1>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Sign out
            </button>
          </form>
        </header>

        <div className="grid flex-1 place-items-center py-16">
          <div className="w-full max-w-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              Phase 1
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white">
              Welcome to the protected Chronicle shell.
            </h2>
            <p className="mt-4 leading-7 text-zinc-300">
              You are signed in as{" "}
              <span className="font-medium text-zinc-100">{email}</span>. The
              workspace, world, and campaign systems will land in focused
              follow-up slices.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
