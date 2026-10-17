"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

interface SplitPaneProps {
  direction: "horizontal" | "vertical"; // horizontal = side by side, vertical = stacked
  first: ReactNode;
  second: ReactNode;
  initial?: number; // starting size of the first pane, in percent
  min?: number;
  max?: number;
}

export default function SplitPane({
  direction,
  first,
  second,
  initial = 50,
  min = 20,
  max = 80,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const horizontal = direction === "horizontal";

  const clamp = (value: number) => Math.min(max, Math.max(min, value));

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    const fraction = horizontal
      ? (e.clientX - box.left) / box.width
      : (e.clientY - box.top) / box.height;
    setSize(clamp(fraction * 100));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 2;
    const grow = horizontal ? "ArrowRight" : "ArrowDown";
    const shrink = horizontal ? "ArrowLeft" : "ArrowUp";
    if (e.key === grow) {
      e.preventDefault();
      setSize((s) => clamp(s + step));
    } else if (e.key === shrink) {
      e.preventDefault();
      setSize((s) => clamp(s - step));
    }
  }

  const containerClass = horizontal
    ? "flex flex-col gap-3 md:h-full md:flex-row md:gap-0"
    : "flex flex-col gap-3 md:h-full md:gap-0";

  const handleClass = horizontal
    ? "split-handle hidden md:flex w-4 shrink-0 cursor-col-resize touch-none"
    : "split-handle hidden md:flex h-4 shrink-0 cursor-row-resize touch-none";

  return (
    <div
      ref={containerRef}
      className={`${containerClass} ${dragging ? "select-none" : ""}`}
      style={{ "--split-size": `${size}%` } as CSSProperties}
    >
      <div className="split-pane-first">{first}</div>

      <div
        role="separator"
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(size)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        className={handleClass}
        data-orientation={direction}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onDoubleClick={() => setSize(initial)}
      >
        <span className="split-grip" />
      </div>

      <div className="split-pane-second">{second}</div>
    </div>
  );
}