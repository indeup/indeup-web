"use client";

import { useEffect, useRef } from "react";
import { useSmoothScrollProgress } from "@/lib/useSmoothScrollProgress";
import { useStaticFallback } from "@/lib/useStaticFallback";
import Reveal from "@/components/Reveal";

// Was three staggered details (frame, finish, tabletop) — trimmed to just
// the lead fact per request. Kept as a single-item object (not inlined)
// since both the pinned and static variants below still read from it.
const detail = {
  num: "01",
  title: "흔들림을 줄이는 아연도금 프레임",
  paragraphs: [
    "상판 아래 아연도금 철제 각관 프레임이 책상 전체를 안정적으로 지지합니다.",
    "타이핑이나 모니터 사용처럼 반복적인 움직임에도 흔들림이 덜하도록, 이음새 없이 하나로 이어지는 풀용접으로 연결 구조와 보강 위치까지 고려해 제작합니다.",
  ],
};

// Video starts playing at PLAY_AT, then the detail fades in at REVEAL_AT.
const PLAY_AT = 0.08;
const REVEAL_AT = 0.16;
const REVEAL_FADE = 0.1;

function revealOpacity(progress: number, start: number) {
  if (progress < start - REVEAL_FADE) return 0;
  if (progress < start) return (progress - (start - REVEAL_FADE)) / REVEAL_FADE;
  return 1;
}

/** Scroll distance (in dvh) the play-trigger + reveal plays out over. */
const SCROLL_SPAN_VH = 200;

function PinnedFrameDetail() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Position is handled by native `position: sticky` below — the browser's
  // compositor pins/releases it in perfect sync with scroll in both
  // directions, with none of the one-frame lag a JS-computed fixed/absolute
  // switch had (that lag showed up as a snap on pin-in, and a gap of page
  // background on release — worse when scrolling back up). `progress` eases
  // toward the raw scroll fraction instead of snapping to it — see
  // useSmoothScrollProgress for why a straight 1:1 mapping to touch-scroll
  // position reads as mechanically rigid.
  const progress = useSmoothScrollProgress(() => {
    const el = wrapperRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = Math.max(rect.height - vh, 0);
    return scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
  });

  // Sits on its first frame until the visitor nudges the scroll forward,
  // then plays — the "stopped GIF that wakes up on scroll" the design asked for.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (progress > PLAY_AT) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [progress]);

  const opacity = revealOpacity(progress, REVEAL_AT);

  return (
    <div id="process" ref={wrapperRef} className="relative" style={{ height: `calc(${SCROLL_SPAN_VH} * var(--vh-unit))` }}>
      <div
        className="sticky top-0 w-full overflow-hidden bg-[var(--color-primary)] text-white"
        style={{ height: "calc(100 * var(--vh-unit))" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/frame-detail.mp4"
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

        <p className="absolute left-6 top-20 text-sm font-semibold uppercase tracking-[0.15em] text-white/50 xl:left-12 sm:top-24">
          <span className="text-[var(--color-brand-light)]">03</span> · 튼튼한 구조
        </p>

        <div
          className="absolute inset-x-6 bottom-16 xl:inset-x-auto xl:left-12 xl:bottom-24 xl:max-w-2xl"
          style={{
            opacity,
            transform: `translateY(${20 * (1 - opacity)}px)`,
          }}
          aria-hidden={opacity === 0}
        >
          <span className="text-sm font-medium text-white/50">{detail.num}</span>
          <h3 className="mt-2 font-bold leading-tight tracking-[-0.02em] text-2xl sm:text-5xl">
            {detail.title}
          </h3>
          <div className="mt-3 flex flex-col gap-2.5">
            {detail.paragraphs.map((para, pi) => (
              <p key={pi} className="leading-7 text-white/70 text-sm sm:text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion fallback: autoplaying video with the detail listed, no pin/scroll-linking. */
function StaticFrameDetail() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-[var(--color-primary)] px-6 py-24 text-white sm:px-12"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/frame-detail.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col gap-12">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
          <span className="text-[var(--color-brand-light)]">03</span> · 튼튼한 구조
        </p>
        <div>
          <span className="text-sm font-medium text-white/50">{detail.num}</span>
          <h3 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">
            {detail.title}
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {detail.paragraphs.map((para, pi) => (
              <p key={pi} className="max-w-xl text-base leading-7 text-white/70">
                {para}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function FrameDetail() {
  const useStatic = useStaticFallback();
  return useStatic ? <StaticFrameDetail /> : <PinnedFrameDetail />;
}
