import type { Cell, HighLight, HighLightKind } from "@/engine/types";

// The colors themselves live in globals.css (.cell-active, .cell-found, ...)
const KIND_CLASS: Record<HighLightKind, string> = {
  active: "cell-active",
  compare: "cell-compare",
  found: "cell-found",
  inserted: "cell-inserted",
  removed: "cell-removed",
};

interface Props {
  data: Cell[];
  highlights: HighLight[];
}

export default function ArrayView({ data, highlights }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-3">
      {data.map((cell, i) => {
        const highlight = highlights.find((h) => h.index === i);
        const kind = highlight ? KIND_CLASS[highlight.kind] : "cell-default";
        const empty = cell === null ? " cell-empty" : "";
        return (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`cell flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold ${kind}${empty}`}
            >
              {cell ?? ""}
            </div>
            <span className="text-xs text-zinc-500">{i}</span>
          </div>
        );
      })}
    </div>
  );
}