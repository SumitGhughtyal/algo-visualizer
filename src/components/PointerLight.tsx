"use client";

import { useEffect } from "react";

// Panels with the "lit" class get a soft light on their edges where the mouse is near
const SELECTOR = ".lit";

export default function PointerLight() {
  useEffect(() => {
    // Only for devices with a real mouse
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const html = document.documentElement;
    const mouse = { x: 0, y: 0 };
    let frame = 0;

    // Give every lit panel the mouse position relative to its own corner
    function paint() {
      frame = 0;
      const panels = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
      const rects = panels.map((panel) => panel.getBoundingClientRect()); // measure first...
      panels.forEach((panel, i) => {
        // ...then write, so the browser only measures the page once per frame
        panel.style.setProperty("--x", `${mouse.x - rects[i].left}px`);
        panel.style.setProperty("--y", `${mouse.y - rects[i].top}px`);
      });
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      html.style.setProperty("--lit-on", "1");
      schedule();
    }

    // The mouse left the window: fade the light out
    function onOut(e: MouseEvent) {
      if (!e.relatedTarget) html.style.setProperty("--lit-on", "0");
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("mouseout", onOut);
      html.style.removeProperty("--lit-on");
    };
  }, []);

  return null;
}