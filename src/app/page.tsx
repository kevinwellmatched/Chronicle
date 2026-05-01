import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-zinc-500">Chronicle Engine</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white sm:text-6xl">
            Private world and campaign tools, built one careful layer at a
            time.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            This is the minimal Next.js foundation for Chronicle Gaming Hub.
            The app scaffold is ready; product features begin in the next
            focused issues.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="border border-emerald-300/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-200"
            >
              Enter app
            </Link>
            <Link
              href="/login"
              className="border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Sign in
            </Link>
          </div>
        </div>
        <div className="mt-12 grid gap-4 text-sm text-zinc-300 sm:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-medium text-white">Phase 0</h2>
            <p className="mt-2 leading-6">Foundation, checks, and app shell.</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-medium text-white">MVP 0.1</h2>
            <p className="mt-2 leading-6">Private world and campaign wiki.</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="font-medium text-white">Next</h2>
            <p className="mt-2 leading-6">Auth shell and workspaces.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
