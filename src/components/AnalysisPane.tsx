import ComplexityChip from "@/components/ComplexityChip";
import type { Stats } from "@/engine/types";

interface Props {
  stats: Stats;
  complexity: string;
  step: number;
  total: number;
}

type Tone = "orange" | "green" | "gradient" | "plain";

const TONE_CLASS: Record<Tone, string> = {
  orange: "tone-orange",
  green: "tone-green",
  gradient: "tone-gradient",
  plain: "",
};

function Tile({ label, value, tone }: { label: string; value: number; tone: Tone }) {
  return (
    <div className="glass-sub flex flex-col items-center justify-center gap-1 px-3 py-3">
      <span className={`text-3xl font-semibold tabular-nums ${TONE_CLASS[tone]}`}>{value}</span>
      <span className="text-xs uppercase tracking-wider text-zinc-400">{label}</span>
    </div>
  );
}

export default function AnalysisPanel({ stats, complexity, step, total }: Props) {
  const operations = stats.comparisons + stats.reads + stats.writes;
  const percent = total > 0 ? (step / total) * 100 : 0;

  return (
    <section className="glass flex h-full flex-col gap-4 overflow-auto p-5">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold">Analysis</h2>
        <ComplexityChip value={complexity} label="Time" />
        <span className="ml-auto text-sm text-zinc-400">
          Step {step} / {total}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Comparisons" value={stats.comparisons} tone="plain" />
        <Tile label="Reads" value={stats.reads} tone="green" />
        <Tile label="Writes" value={stats.writes} tone="orange" />
        <Tile label="Total ops" value={operations} tone="gradient" />
      </div>

      <div className="h-2 shrink-0 overflow-hidden rounded-full bg-white/10">
        <div
          className="progress-fill h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-zinc-500">
        The interactive complexity graph will live in this panel once the analyzer is added.
      </p>
    </section>
  );
}