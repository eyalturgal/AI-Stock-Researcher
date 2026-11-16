import { siteConfig } from "@/config/site";

// The home page. This is the "hello world" for Phase 0: its only job is to
// prove the site builds and deploys. The real layout arrives in Phase 1.
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-300">
          {siteConfig.description}
        </p>
        <p className="mt-8 text-sm text-zinc-400">{siteConfig.status}</p>
      </div>
    </main>
  );
}
