import { useEffect, useState } from "react";

/**
 * True when a section's pinned/scroll-linked variant should be replaced by
 * its plain, normal-flow static fallback — either because the visitor has
 * asked for reduced motion, or because they're on a mobile viewport.
 *
 * Scroll-linked pin/reveal effects map screen motion directly to touch-drag
 * position, and getting that to feel right on real mobile devices (rather
 * than just in a desktop-emulated mobile viewport) repeatedly proved harder
 * than the payoff was worth — bounce, gaps, overlapping transitions, slide
 * skipping and a too-rigid 1:1 feel, across several rounds of fixes.
 * Desktop, where scrolling is wheel/trackpad-driven rather than a direct
 * finger drag, keeps the full cinematic pinned version.
 */
export function useStaticFallback(): boolean {
  const [shouldUseStatic, setShouldUseStatic] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    function update() {
      setShouldUseStatic(reducedMotionQuery.matches || mobileQuery.matches);
    }
    update();

    reducedMotionQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);
    return () => {
      reducedMotionQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return shouldUseStatic;
}
