"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { APP_NAME_PARTS } from "@/config";

// Timing of the "eyes", in milliseconds
const FIRST_WAKE = 3000; // first wake-up after the page loads
const WAKE_EVERY = 5000; // then an eye wakes every WAKE_EVERY to WAKE_EVERY + WAKE_SPREAD
const WAKE_SPREAD = 4000;
const AWAKE_FOR = 2600; // keep in sync with the eye-awake animation length in intro.css
const LOOK_RANGE = 160; // cursor distance (px) at which the pupil is fully turned toward it

// The dot of an "i" is replaced by an eye. The letter itself is drawn as a dotless i.
function Eye({ delay }: { delay: string }) {
  return (
    <span className="eye-i" data-eye="" style={{ "--eye-delay": delay } as CSSProperties}>
      {"\u0131"}
      <span className="eye-dot">
        <span className="eye-pupil" />
      </span>
    </span>
  );
}

export default function Wordmark() {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const eyes = Array.from(root.querySelectorAll<HTMLElement>("[data-eye]"));
    if (eyes.length === 0) return;

    // Where the cursor is (the page center until the mouse first moves)
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    function onMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }
    window.addEventListener("pointermove", onMove);

    let next = 0; // which eye wakes up next
    let active: HTMLElement | null = null;
    let wakeTimer = 0;
    let sleepTimer = 0;
    let frame = 0;

    // While an eye is awake, turn its pupil toward the cursor on every frame
    function look() {
      const eye = active;
      if (!eye) return;
      const box = eye.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const strength = Math.min(1, dist / LOOK_RANGE);
      eye.style.setProperty("--lx", String((dx / dist) * strength));
      eye.style.setProperty("--ly", String((dy / dist) * strength));
      frame = requestAnimationFrame(look);
    }

    function settle() {
      cancelAnimationFrame(frame);
      if (active) {
        active.dataset.awake = "false";
        active.style.setProperty("--lx", "0");
        active.style.setProperty("--ly", "0");
        active = null;
      }
    }

    function wake() {
      const eye = eyes[next % eyes.length];
      next += 1;
      active = eye;
      eye.dataset.awake = "true";
      look();
      sleepTimer = window.setTimeout(sleep, AWAKE_FOR);
    }

    function sleep() {
      settle();
      schedule();
    }

    function schedule(delay = WAKE_EVERY + Math.random() * WAKE_SPREAD) {
      wakeTimer = window.setTimeout(wake, delay);
    }

    function stop() {
      window.clearTimeout(wakeTimer);
      window.clearTimeout(sleepTimer);
      settle();
    }

    // Pause while the tab is hidden
    function onVisibility() {
      if (document.hidden) stop();
      else schedule();
    }
    document.addEventListener("visibilitychange", onVisibility);

    schedule(FIRST_WAKE);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Split each line at its i's, and put an eye in each gap
  const lines = APP_NAME_PARTS.map((part) => part.split("i"));
  // How many eyes come before each line, so every eye gets its own number
  const before = lines.map((_, line) =>
    lines.slice(0, line).reduce((sum, parts) => sum + parts.length - 1, 0),
  );

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      className="brand-name block text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl"
    >
      {lines.map((parts, line) => (
        <span key={line} className="block">
          {parts.map((text, i) => (
            <Fragment key={i}>
              {text}
              {i < parts.length - 1 && <Eye delay={`${-2.5 * (before[line] + i)}s`} />}
            </Fragment>
          ))}
        </span>
      ))}
    </span>
  );
}