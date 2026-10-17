import Link from "next/link";
import { APP_NAME, APP_NAME_PARTS, REPO_URL } from "@/config";

export default function SiteHeader({ active }: { active: "home" | "visualizer" }) {
  return (
    <header className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
      {/* Left half: big branding */}
      <Link href="/" aria-label={`${APP_NAME} home`}>
        <span className="brand-name brand-shimmer block w-fit text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          {APP_NAME_PARTS[0]}
          <br />
          {APP_NAME_PARTS[1]}
        </span>
      </Link>

      {/* Right half: navigation, aligned to the right edge */}
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center gap-x-7 gap-y-2 md:justify-end md:pt-3"
      >
        <Link href="/" className="site-link" data-active={active === "home"}>
          Home
        </Link>
        <Link href="/visualizer" className="site-link" data-active={active === "visualizer"}>
          Visualizer
        </Link>
        <span className="site-link" aria-disabled="true">
          Analyzer <span className="nav-soon">Soon</span>
        </span>
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="site-link">
          GitHub
        </a>
      </nav>
    </header>
  );
}