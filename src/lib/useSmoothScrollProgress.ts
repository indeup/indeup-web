import { useEffect, useRef, useState } from "react";

/**
 * Drives a 0–1 progress value from scroll position, but never snaps
 * straight to the raw scroll fraction — it continuously eases toward it.
 * A touchscreen drag moves 1:1 with the finger, so scroll-linked visuals
 * that map to that raw position exactly inherited that same rigid,
 * mechanical exactness; a mouse-driven site doesn't feel this because wheel
 * scrolling is already quantized/inertial. Easing the *displayed* progress
 * toward the *target* progress (instead of assigning it directly) restores
 * the lag a scroll-driven animation is expected to have, regardless of
 * input device.
 *
 * Runs its own rAF loop rather than only reacting to scroll events, so the
 * easing keeps animating toward the target for a few frames after the
 * finger/wheel stops.
 */
export function useSmoothScrollProgress(
  computeTarget: () => number,
  smoothing = 0.16
): number {
  const [progress, setProgress] = useState(0);
  const currentRef = useRef(0);
  const computeTargetRef = useRef(computeTarget);
  computeTargetRef.current = computeTarget;

  useEffect(() => {
    let rafId: number;
    function tick() {
      const target = computeTargetRef.current();
      const current = currentRef.current;
      const diff = target - current;
      const next = Math.abs(diff) < 0.0006 ? target : current + diff * smoothing;
      currentRef.current = next;
      setProgress(next);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smoothing]);

  return progress;
}
