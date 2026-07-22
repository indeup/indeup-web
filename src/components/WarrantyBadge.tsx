"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Slot-machine style: cycles through 1 → target repeatedly (blurred, fast)
 * and decelerates into a clean, sharp landing on the target — reads as the
 * counter "spinning up" through the real range rather than random noise or
 * a plain linear count.
 */
function useSlotCountUp(target: number, active: boolean, spinDuration = 1100) {
  const [display, setDisplay] = useState(1);
  const [phase, setPhase] = useState<"idle" | "spinning" | "landed">("idle");

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      setPhase("landed");
      return;
    }

    setPhase("spinning");
    const start = performance.now();
    let raf: number;
    let lastTick = start;
    let interval = 55;
    let cycle = 0;

    function tick(now: number) {
      const t = Math.min((now - start) / spinDuration, 1);
      if (t >= 1) {
        setDisplay(target);
        setPhase("landed");
        return;
      }
      if (now - lastTick >= interval) {
        setDisplay((cycle % target) + 1);
        cycle += 1;
        lastTick = now;
        // Ticks start fast (~55ms) and stretch out to a lazy ~230ms near the
        // end, like a reel winding down instead of stopping mid-blur.
        interval = 55 + Math.pow(t, 2) * 175;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, spinDuration]);

  return { display, phase };
}

export default function WarrantyBadge() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { display: years, phase } = useSlotCountUp(3, visible);

  return (
    <section className="bg-[var(--color-primary)] px-6 py-28 text-center text-white sm:px-12 sm:py-36">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl transition-all duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-lg font-medium text-white/70 sm:text-xl">
          인디업의 모든 제품
        </p>
        <p
          className="mt-2 font-bold leading-none tracking-[-0.02em]"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          품질보증{" "}
          <span
            key={phase === "landed" ? "landed" : "spinning"}
            className={`inline-block tabular-nums text-[var(--color-brand-light)] ${
              phase === "landed" ? "animate-[count-land_320ms_ease-out]" : ""
            }`}
            style={{
              filter: phase === "spinning" ? "blur(6px)" : "blur(0px)",
              transition: "filter 120ms ease-out",
            }}
          >
            {years}
          </span>
          년.
        </p>
        <p className="mt-8 text-base font-medium uppercase tracking-[0.15em] text-white/60">
          무료 교환 · 반품 · 배송
        </p>
      </div>
    </section>
  );
}
