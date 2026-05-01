import Link from "next/link";
import { redirect } from "next/navigation";

import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

import { signInWithMagicLink } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeRedirectPath(params.next);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (!error && data?.claims) {
    redirect(next);
  }

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
        <Link
          href="/"
          className="font-mono text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          Chronicle Engine
        </Link>

        <div className="mt-8 border border-white/10 bg-white/[0.03] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
            Private access
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white">
            Sign in to Chronicle.
          </h1>
          <p className="mt-3 leading-7 text-zinc-300">
            Enter the email already allowed for this private workspace. Chronicle
            will send a one-time sign-in link.
          </p>

          <form action={signInWithMagicLink} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="text-sm font-medium text-zinc-200">Email</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              className="w-full border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
            >
              Send sign-in link
            </button>
          </form>

          {params.message ? (
            <p className="mt-5 border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm leading-6 text-emerald-100">
              {params.message}
            </p>
          ) : null}

          {params.error ? (
            <p className="mt-5 border border-red-300/20 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
              {params.error}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
