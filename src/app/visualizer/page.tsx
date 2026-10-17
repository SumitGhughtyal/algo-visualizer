import Link from "next/link";
import SceneBackground from "@/components/SceneBackground";
import { Logo } from "@/components/TopBar";
import { APP_NAME, APP_TAGLINE, REPO_URL } from "@/config";

const FEATURES = [
  {
    title: "Step-by-step visuals",
    text: "Every operation plays out frame by frame. Pause, step back, or change the speed.",
  },
  {
    title: "Live operation counts",
    text: "Watch comparisons, reads, and writes climb as the algorithm runs.",
  },
  {
    title: "Complexity analysis",
    text: "See how cost grows with input size, and compare it with the theory.",
  },
];

export default function HomePage() {
  return (
    <main className="app-bg relative isolate min-h-dvh overflow-hidden">
      <SceneBackground />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 p-4">
        <header className="glass glass-bar flex items-center gap-4 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <span className="brand-name text-base font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1" aria-label="Main">
            <Link href="/" className="nav-tab" data-active="true">
              Home
            </Link>
            <Link href="/visualizer" className="nav-tab">
              Visualizer
            </Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="nav-link ml-2">
              GitHub
            </a>
          </nav>
        </header>

        <section className="flex flex-1 items-center py-6">
          <div className="glass w-full max-w-3xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="mx-auto text-xs text-zinc-500">algolens</span>
            </div>

            <div className="flex flex-col gap-6 p-8 md:p-12">
              <div>
                <h1 className="brand-name text-5xl font-bold tracking-tight md:text-6xl">
                  {APP_NAME}
                </h1>
                <p className="mt-2 text-3xl font-light text-zinc-200 md:text-4xl">
                  see how algorithms think.
                </p>
              </div>

              <p className="max-w-xl text-zinc-400">
                Step through data structures and algorithms one operation at a time, with live
                counts of every comparison, read, and write.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="chip chip-green">Data structures</span>
                <span className="chip chip-green">Sorting</span>
                <span className="chip chip-green">Graphs</span>
                <span className="chip">Analyzer</span>
              </div>

              <div className="flex max-w-md gap-3">
                <Link href="/visualizer" className="glass-btn glass-btn-primary text-center">
                  Open visualizer
                </Link>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn text-center"
                >
                  View source
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="glass p-5">
              <h2 className="panel-title">{feature.title}</h2>
              <p className="mt-2 text-sm text-zinc-300">{feature.text}</p>
            </div>
          ))}
        </section>

        <footer className="pb-2 text-center text-xs text-zinc-500">{APP_TAGLINE}</footer>
      </div>
    </main>
  );
}