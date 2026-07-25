"use client";

import { useRef } from "react";
import { useSmoothScrollProgress } from "@/lib/useSmoothScrollProgress";
import { useStaticFallback } from "@/lib/useStaticFallback";

const chips = ["국내 제조·판매", "10mm 맞춤 제작", "3년 무상보증"];

/** Scroll distance (in dvh) the staged badge/headline/chip reveal plays out over. */
const SCROLL_SPAN_VH = 200;

function ScrollCue({ opacity }: { opacity: number }) {
  return (
    <div
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50"
      style={{ opacity, transition: "opacity 200ms ease-out" }}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">Scroll</span>
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="6 13 12 19 18 13" />
      </svg>
    </div>
  );
}

function PinnedHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Same sticky + scroll-progress technique as the homepage's pinned zoom
  // statement: a tall wrapper holds the scroll range, the visible frame is
  // `position: sticky` so it pins/releases perfectly in sync with scroll.
  // `progress` eases toward the raw scroll fraction instead of snapping to
  // it — see useSmoothScrollProgress for why a straight 1:1 mapping to
  // touch-scroll position reads as mechanically rigid.
  const progress = useSmoothScrollProgress(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = Math.max(rect.height - vh, 0);
    return scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
  });

  const stage = (start: number, span: number) =>
    Math.min(Math.max((progress - start) / span, 0), 1);

  const badgeT = stage(0.04, 0.1);
  const headlineT = stage(0.12, 0.16);
  const subT = stage(0.26, 0.12);
  const chipTs = chips.map((_, i) => stage(0.38 + i * 0.1, 0.1));

  const cueOpacity = 1 - Math.min(progress / 0.06, 1);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `calc(${SCROLL_SPAN_VH} * var(--vh-unit))` }}>
      <div
        className="grain sticky top-0 flex items-center justify-center overflow-hidden bg-[var(--color-primary)] px-6 text-center text-white sm:px-12"
        style={{ height: "calc(100 * var(--vh-unit))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed
            full-bleed hero background, not a next/image layout fit. */}
        <img
          src="/jump.gif"
          alt="아연도금 철제 프레임과 풀용접 구조의 인디업 책상"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          style={{ objectPosition: "center 65%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/70 to-[var(--color-primary)]/45" />

        <div className="relative flex flex-col items-center">
          <span
            className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]"
            style={{
              opacity: badgeT,
              transform: `translateY(${16 * (1 - badgeT)}px)`,
              transition: "opacity 250ms ease-out, transform 250ms ease-out",
            }}
          >
            Our Collection
          </span>
          <h1
            className="mt-6 max-w-3xl font-bold leading-[1.15] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 4.5rem)",
              opacity: headlineT,
              transform: `translateY(${24 * (1 - headlineT)}px)`,
              transition: "opacity 300ms ease-out, transform 300ms ease-out",
            }}
          >
            공간에 맞는
            <br />
            인디업 맞춤책상
          </h1>
          <p
            className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg"
            style={{
              opacity: subT,
              transform: `translateY(${16 * (1 - subT)}px)`,
              transition: "opacity 250ms ease-out, transform 250ms ease-out",
            }}
          >
            1인용부터 2인용, 좌식, 사이드테이블과 홈바테이블까지.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {chips.map((label, i) => (
              <span
                key={label}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold tracking-[-0.01em] text-white/80"
                style={{
                  opacity: chipTs[i],
                  transform: `translateY(${12 * (1 - chipTs[i])}px)`,
                  transition: "opacity 250ms ease-out, transform 250ms ease-out",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <ScrollCue opacity={cueOpacity} />
      </div>
    </div>
  );
}

/** Reduced-motion fallback: the end state as a normal static block, no scroll-linked reveal. */
function StaticHero() {
  return (
    <section className="grain relative flex min-h-[85dvh] items-center justify-center overflow-hidden bg-[var(--color-primary)] px-6 py-24 text-center text-white sm:px-12">
      {/* eslint-disable-next-line @next/next/no-img-element -- fixed
          full-bleed hero background, not a next/image layout fit. */}
      <img
        src="/jump.gif"
        alt="인디업 책상 위에 올라서도 흔들림 없는 내구성"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        style={{ objectPosition: "center 65%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/70 to-[var(--color-primary)]/45" />

      <div className="relative flex flex-col items-center">
        <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Our Collection
        </span>
        <h1
          className="mt-6 max-w-3xl font-bold leading-[1.15] tracking-[-0.03em]"
          style={{ fontSize: "clamp(1.75rem, 6vw, 4.5rem)" }}
        >
          공간에 맞는
          <br />
          인디업 맞춤책상
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
          1인용부터 2인용, 좌식, 사이드테이블과 홈바테이블까지.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {chips.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold tracking-[-0.01em] text-white/80"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <ScrollCue opacity={1} />
    </section>
  );
}

export default function ProductsHero() {
  const useStatic = useStaticFallback();
  return useStatic ? <StaticHero /> : <PinnedHero />;
}
