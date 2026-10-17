"use client";

import { useEffect, useState } from "react";
import { finalData } from "@/engine/recorder";
import type { Frame, OperationResult } from "@/engine/types";
import { deleteAt, insertAt } from "@/structures/array";

// The loop: insert 42 at index 2, then delete it again, so the array ends as it began
const START = [8, 3, 5, 12, 7];
const STEP_MS = 750; // time per frame
const HOLD_MS = 1700; // pause after each operation finishes
const SLOT_REM = 3.5; // cell width plus gap, in rem (cell 3rem + gap 0.5rem)

interface Step {
  frame: Frame;
  name: string;
  complexity: string;
}

function toSteps(op: OperationResult): Step[] {
  return op.frames.map((frame) => ({ frame, name: op.name, complexity: op.complexity }));
}

// Built once from the same engine that powers the visualizer page
const inserted = insertAt(START, 2, 42);
const deleted = deleteAt(finalData(inserted), 2);
const STEPS: Step[] = [...toSteps(inserted), ...toSteps(deleted)];
const HOLD_AT = inserted.frames.length - 1; // last frame of the insert

export default function HeroDemo() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advance one frame at a time, holding a little longer when an operation ends
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const last = STEPS.length - 1;
    const wait = index === last || index === HOLD_AT ? HOLD_MS : STEP_MS;
    const id = window.setTimeout(() => setIndex((i) => (i >= last ? 0 : i + 1)), wait);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  const { frame, name, complexity } = STEPS[index];
  const { reads, writes, comparisons } = frame.stats;
  const progress = ((index + 1) / STEPS.length) * 100;

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="panel-title">Live preview</span>
        <span className="chip">{complexity}</span>
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-100">{name}</p>

      {/* Each cell is keyed by its value, so it glides to its new slot instead of jumping */}
      <div className="relative mt-5 h-12 w-[20.5rem] max-w-full">
        {frame.data.map((cell, i) => {
          const kind = frame.highlights.find((h) => h.index === i)?.kind;
          return (
            <div
              key={cell ?? "empty"}
              className="demo-slot"
              style={{ transform: `translateX(${i * SLOT_REM}rem)` }}
            >
              <div className="demo-pop">
                <div className="demo-cell" data-kind={kind ?? "idle"} data-empty={cell === null}>
                  {cell ?? ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2">
        {frame.data.map((_, i) => (
          <span key={i} className="w-12 text-center text-[0.7rem] text-zinc-500">
            {i}
          </span>
        ))}
      </div>

      <p className="mt-4 min-h-10 text-xs leading-5 text-zinc-400">{frame.message}</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Reads", value: reads },
          { label: "Writes", value: writes },
          { label: "Total", value: reads + writes + comparisons },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2">
            <div className="text-lg font-semibold tabular-nums text-zinc-100">{stat.value}</div>
            <div className="text-[0.65rem] uppercase tracking-wider text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-px w-full overflow-hidden bg-white/10">
        <div className="demo-progress h-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}