import Link from "next/link";
import HeroDemo from "@/components/HeroDemo";
import SceneBackground from "@/components/SceneBackground";
import SiteHeader from "@/components/SiteHeader";
import { APP_TAGLINE, REPO_URL } from "@/config";

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

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <section className="glass glass-in flex flex-1 flex-col overflow-hidden md:min-h-[32rem] md:flex-none">
          <div className="flex flex-1 flex-col gap-10 p-8 md:p-12">
            <SiteHeader active="home" />

            <div className="grid flex-1 gap-10 lg:grid-cols-2">
              {/* Left: headline, text, tags, buttons */}
              <div className="flex flex-col gap-10">
                <div className="pt-4 md:pt-8">
                  <p className="text-4xl font-light tracking-tight text-zinc-100 md:text-5xl">
                    see how algorithms think.
                  </p>
                  <p className="mt-4 max-w-xl text-zinc-400">
                    Step through data structures and algorithms one operation at a time, with live
                    counts of every comparison, read, and write.
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">Data structures</span>
                    <span className="chip">Sorting</span>
                    <span className="chip">Graphs</span>
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

              {/* Right: the live preview (hidden on narrower screens) */}
              <div className="hidden items-center justify-end lg:flex">
                <HeroDemo />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-in-group grid gap-3 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="glass glass-in p-5">
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