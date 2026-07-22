"use client";

import { useEffect, useRef, useState } from "react";

const captionLines = [
  ["매일 앉는 자리일수록,", "더 정확해야 합니다."],
  ["공간과 사용 방식에 맞춰", "인디업이 책상의 크기를 다시 정합니다."],
];

// The install photo shows through the letterforms from the very start of
// the zoom, so scaling the headline reads as zooming into the photo itself
// (matching the reference: text is a window onto the image, not a separate
// abstract fill that later cuts to the real picture).
const photoUrl = "url('/indeup_desk.jpg')";

/** Scroll distance (in dvh) the whole zoom/reveal/caption sequence plays out over. */
const SCROLL_SPAN_VH = 320;

/** Eases both the start and end of the zoom so it never feels like a sudden jump. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function PinnedZoom() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Position is handled by native `position: sticky` below — the browser
  // pins/releases it in perfect sync with scroll in both directions, with
  // none of the one-frame lag a JS-computed fixed/absolute switch had (that
  // lag showed up as a snap on pin-in and a gap of page background on
  // release). This effect only needs to read scroll position to drive the
  // content reveal.
  useEffect(() => {
    function update() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = Math.max(rect.height - vh, 0);
      setProgress(
        scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0
      );
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Phase 0 (0 -> 0.12): hold — headline sits still at full size so it's
  // actually readable before anything starts moving.
  // Phase 1 (0.12 -> 0.5): headline scales up (eased, not linear) as its
  // material-pattern fill "zooms in" through the letterforms.
  const HOLD_END = 0.12;
  const ZOOM_END = 0.5;
  const zoomT = Math.min(Math.max((progress - HOLD_END) / (ZOOM_END - HOLD_END), 0), 1);
  const textScale = progress <= HOLD_END ? 1 : 1 + easeInOutCubic(zoomT) * 13;
  const textOpacity =
    progress < 0.42 ? 1 : Math.max(1 - (progress - 0.42) / 0.1, 0);
  // Sits above the headline only while it's at rest — fades out fast as
  // soon as the zoom starts so it never gets swept into the scaling text.
  const badgeOpacity = 1 - Math.min(zoomT * 4, 1);

  // Phase 2 (0.4 -> 0.56): the same pattern takes over the full frame,
  // masking the seam where the scaled-up text would otherwise clip.
  const bgOpacity = Math.min(Math.max((progress - 0.4) / 0.16, 0), 1);

  return (
    <div id="brand" ref={wrapperRef} className="relative" style={{ height: `${SCROLL_SPAN_VH}dvh` }}>
      <div
        className="sticky top-0 w-full overflow-hidden bg-[var(--color-primary)]"
        style={{ height: "100dvh" }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
          style={{ opacity: textOpacity }}
          aria-hidden={textOpacity === 0}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]"
            style={{ opacity: badgeOpacity, transition: "opacity 200ms ease-out" }}
          >
            Made in Korea
          </span>
          <h2
            className="text-center font-extrabold leading-[1.05] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 5rem)",
              transform: `scale(${textScale})`,
              transition: "transform 200ms ease-out",
              backgroundImage: photoUrl,
              backgroundSize: "cover",
              backgroundPosition: "center 28%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Precision-Fit
            <br />
            Desk Solutions
          </h2>
        </div>

        <div
          className="absolute inset-0"
          style={{
            opacity: bgOpacity,
            transition: "opacity 200ms ease-out",
            backgroundImage: photoUrl,
            backgroundSize: "cover",
            backgroundPosition: "center 28%",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/55"
          style={{ opacity: bgOpacity, transition: "opacity 200ms ease-out" }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50"
            style={{ opacity: bgOpacity, transition: "opacity 200ms ease-out" }}
          >
            <span className="text-[var(--color-brand-light)]">01</span> · Indeup Design Principle
          </p>
          <div
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]"
            style={{ opacity: bgOpacity, transition: "opacity 200ms ease-out" }}
          >
            Made in Korea
          </div>
          {captionLines.map((block, i) => {
            const start = 0.62 + i * 0.14;
            const lineOpacity = Math.min(Math.max((progress - start) / 0.13, 0), 1);
            return (
              <p
                key={block[0]}
                className="max-w-xl text-xl font-medium text-white sm:text-2xl"
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${24 * (1 - lineOpacity)}px)`,
                  transition: "opacity 200ms ease-out, transform 200ms ease-out",
                }}
              >
                {block.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            );
          })}
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-6 text-white/40"
            style={{
              opacity: progress > 0.93 ? 1 : 0,
              transition: "opacity 300ms ease-out",
            }}
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="6 13 12 19 18 13" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion fallback: the end state as a normal static block, no scroll-linked scaling. */
function StaticStatement() {
  return (
    <section id="brand" className="bg-[var(--color-primary)] px-6 py-32 text-center text-white sm:px-12 sm:py-40">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
        <span className="text-[var(--color-brand-light)]">01</span> · Indeup Design Principle
      </p>
      <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
        Made in Korea
      </div>
      <h2
        className="mx-auto mt-6 max-w-4xl font-bold leading-[1.1] tracking-[-0.03em]"
        style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
      >
        Precision-Fit
        <br />
        Desk Solutions
      </h2>
      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-2">
        {captionLines.map((block) => (
          <p key={block[0]} className="text-base leading-7 text-white/60">
            {block.join(" ")}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function ZoomStatement() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return reducedMotion ? <StaticStatement /> : <PinnedZoom />;
}
