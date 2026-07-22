"use client";

import { useEffect, useRef, useState } from "react";

const details = [
  {
    num: "01",
    title: "흔들림을 줄이는 아연도금 프레임",
    paragraphs: [
      "상판 아래 아연도금 철제 각관 프레임이 책상 전체를 안정적으로 지지합니다.",
      "타이핑이나 모니터 사용처럼 반복적인 움직임에도 흔들림이 덜하도록, 이음새 없이 하나로 이어지는 풀용접으로 연결 구조와 보강 위치까지 고려해 제작합니다.",
    ],
  },
  {
    num: "02",
    title: "오래 쓰기 위한 꼼꼼한 마감",
    paragraphs: [
      "프레임의 모서리와 용접 부위를 직접 확인하고 다듬은 뒤, 분체도장으로 표면을 마감합니다.",
      "쉽게 벗겨지는 단순 도장이 아니라 도료를 고온에서 경화해, 오랫동안 깔끔하게 사용할 수 있도록 제작합니다. 프레임은 3년 무상보증을 제공합니다.",
    ],
  },
  {
    num: "03",
    title: "안정적으로 받쳐주는 18mm 상판",
    paragraphs: [
      "18mm 두께의 E0 LPM 상판을 사용해 모니터와 작업 장비를 안정적으로 받쳐줍니다.",
      "상판 아래 프레임이 함께 지지하도록 설계해 휨을 줄였으며, 표면 관리도 쉬워 일상적인 업무와 컴퓨터 작업에 부담 없이 사용할 수 있습니다.",
    ],
  },
];

// Video starts playing at PLAY_AT. Each detail then fades in at its own
// scroll checkpoint and stays on screen — they accumulate in different
// corners rather than replacing one another, echoing the reference layout's
// scattered stat blocks.
const PLAY_AT = 0.08;
const REVEAL_AT = [0.16, 0.42, 0.64];
const REVEAL_FADE = 0.1;

function revealOpacity(progress: number, start: number) {
  if (progress < start - REVEAL_FADE) return 0;
  if (progress < start) return (progress - (start - REVEAL_FADE)) / REVEAL_FADE;
  return 1;
}

// Position + size per detail. On mobile there's no room to scatter three
// blocks into separate corners without them overlapping, so all three share
// one bottom band and only the active one renders (see `isActive` below);
// from `sm` up, each gets its own corner and all revealed ones stay on
// screen together. 01 runs larger since it's the lead fact.
const layout = [
  {
    wrap: "inset-x-6 bottom-16 xl:inset-x-auto xl:left-12 xl:bottom-24 xl:max-w-2xl",
    title: "text-2xl sm:text-5xl",
    body: "text-sm sm:text-lg",
  },
  {
    wrap: "inset-x-6 bottom-16 xl:inset-x-auto xl:right-12 xl:top-28 xl:bottom-auto xl:max-w-sm",
    title: "text-2xl sm:text-2xl",
    body: "text-sm sm:text-base",
  },
  {
    wrap: "inset-x-6 bottom-16 xl:inset-x-auto xl:right-12 xl:bottom-24 xl:max-w-sm",
    title: "text-2xl sm:text-2xl",
    body: "text-sm sm:text-base",
  },
];

/** Scroll distance (in dvh) the play-trigger + three-part crossfade plays out over. */
const SCROLL_SPAN_VH = 320;

function PinnedFrameDetail() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  // Position is handled by native `position: sticky` below — the browser's
  // compositor pins/releases it in perfect sync with scroll in both
  // directions, with none of the one-frame lag a JS-computed fixed/absolute
  // switch had (that lag showed up as a snap on pin-in, and a gap of page
  // background on release — worse when scrolling back up). This effect only
  // needs to read the scroll position to drive the content reveal.
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

  const activeIndex =
    progress >= REVEAL_AT[2] ? 2 : progress >= REVEAL_AT[1] ? 1 : 0;

  function goTo(i: number) {
    const el = wrapperRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + REVEAL_AT[i] * scrollable + scrollable * 0.02;
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  return (
    <div id="process" ref={wrapperRef} className="relative" style={{ height: `${SCROLL_SPAN_VH}dvh` }}>
      <div
        className="sticky top-0 w-full overflow-hidden bg-[var(--color-primary)] text-white"
        style={{ height: "100dvh" }}
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

        {details.map((d, i) => {
          const opacity = revealOpacity(progress, REVEAL_AT[i]);
          const pos = layout[i];
          const isActive = i === activeIndex;
          return (
            <div
              key={d.num}
              className={`absolute ${pos.wrap} ${isActive ? "" : "hidden xl:block"}`}
              style={{
                opacity,
                transform: `translateY(${20 * (1 - opacity)}px)`,
              }}
              aria-hidden={opacity === 0}
            >
              <span className="text-sm font-medium text-white/50">{d.num}</span>
              <h3 className={`mt-2 font-bold leading-tight tracking-[-0.02em] ${pos.title}`}>
                {d.title}
              </h3>
              <div className="mt-3 flex flex-col gap-2.5">
                {d.paragraphs.map((para, pi) => (
                  <p key={pi} className={`leading-7 text-white/70 ${pos.body}`}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        <div className="absolute right-6 top-20 z-10 flex flex-col items-center gap-3 xl:right-12 xl:top-1/2 xl:-translate-y-1/2">
          {details.map((d, i) => (
            <button
              key={d.num}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${d.num} ${d.title}`}
              aria-current={i === activeIndex}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                i === activeIndex
                  ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                  : "border-white/40 text-white/60 hover:border-white/80 hover:text-white"
              }`}
            >
              {d.num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion fallback: autoplaying video with all three details listed, no pin/scroll-linking. */
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
      <div className="relative mx-auto flex max-w-3xl flex-col gap-12">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
          <span className="text-[var(--color-brand-light)]">03</span> · 튼튼한 구조
        </p>
        {details.map((d) => (
          <div key={d.num}>
            <span className="text-sm font-medium text-white/50">{d.num}</span>
            <h3 className="mt-2 text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">
              {d.title}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {d.paragraphs.map((para, pi) => (
                <p key={pi} className="max-w-xl text-base leading-7 text-white/70">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FrameDetail() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return reducedMotion ? <StaticFrameDetail /> : <PinnedFrameDetail />;
}
