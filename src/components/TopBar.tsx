import { APP_NAME, APP_TAGLINE, NAV_ITEMS, REPO_URL, type SectionId } from "@/config";

interface Props {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6a00" />
          <stop offset="1" stopColor="#2bff88" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      <rect x="8" y="16" width="4" height="8" rx="2" fill="#07080a" />
      <rect x="14" y="10" width="4" height="14" rx="2" fill="#07080a" />
      <rect x="20" y="13" width="4" height="11" rx="2" fill="#07080a" />
    </svg>
  );
}

export default function TopBar({ active, onChange }: Props) {
  return (
    <header className="glass glass-bar flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <Logo />
        <div className="leading-tight">
          <p className="brand-name text-base font-semibold tracking-tight">{APP_NAME}</p>
          <p className="hidden text-[0.7rem] text-zinc-400 sm:block">{APP_TAGLINE}</p>
        </div>
      </div>

      <nav
        aria-label="Sections"
        className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:min-w-0 md:w-auto md:flex-1"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="nav-tab"
            data-active={item.id === active}
            aria-current={item.id === active ? "page" : undefined}
            disabled={!item.ready}
            title={item.ready ? undefined : "Coming soon"}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {!item.ready && <span className="nav-soon">Soon</span>}
          </button>
        ))}
      </nav>

      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link ml-auto"
      >
        GitHub
      </a>
    </header>
  );
}