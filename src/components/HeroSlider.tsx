"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useStaticFallback } from "@/lib/useStaticFallback";
import Reveal from "@/components/Reveal";

type HeadlineSegment = { text: string; strong?: boolean };

type Slide = {
  eyebrow: string;
  /** Each entry is one forced line (max 2 lines per the design spec); each line is a list of segments so a key word can be emphasized. */
  headline: HeadlineSegment[][];
  /** Each entry is one forced line (max 2 lines). */
  desc: string[];
  ctaLabel: string;
  ctaHref: string;
  video?: string;
  image?: string;
  /** Override the default hero type size for slides whose longest line needs more room. */
  headlineSize?: string;
};

const slides: Slide[] = [
  {
    eyebrow: "MADE TO FIT YOUR SPACE",
    headline: [
      [{ text: "공간을 재는 순간," }],
      [{ text: "책상은 " }, { text: "달라져야", strong: true }, { text: " 합니다." }],
    ],
    desc: ["줄자로 잰 사이즈 그대로,", "인디업이 당신의 공간에 맞춰 제작합니다."],
    ctaLabel: "인디업 알아보기",
    ctaHref: "#process",
    video: "/videos/indeup-hero.mp4",
    headlineSize: "clamp(1.75rem, 6.25vw, 5rem)",
  },
  {
    eyebrow: "ONE PERSON DESK",
    headline: [
      [{ text: "한 사람의 공간을," }],
      [{ text: "더 " }, { text: "정확하게", strong: true }, { text: "." }],
    ],
    desc: ["작은 방부터 홈오피스까지,", "사용하는 자리와 방식에 맞춰 제작합니다."],
    ctaLabel: "1인용 책상 보기",
    ctaHref: "#contact",
    image: "/one_person_desk.jpg",
  },
  {
    eyebrow: "TWO PERSON DESK",
    headline: [
      [{ text: "함께하는 자리에는," }],
      [{ text: "더 " }, { text: "단단한", strong: true }, { text: " 기준을." }],
    ],
    desc: ["두 사람의 공간을 하나로 연결하는", "안정적인 프레임과 넉넉한 상판을 완성합니다."],
    ctaLabel: "2인용 책상 보기",
    ctaHref: "#contact",
    image: "/two_person_desk.jpg",
  },
  {
    eyebrow: "FLOOR-SITTING DESK",
    headline: [
      [{ text: "낮게 앉아도," }],
      [{ text: "책상의 기준은 " }, { text: "낮추지 않습니다", strong: true }, { text: "." }],
    ],
    desc: ["좌식 생활에 맞는 높이와", "흔들림을 줄인 묵직한 구조로 제작합니다."],
    ctaLabel: "좌식 책상 보기",
    ctaHref: "#contact",
    headlineSize: "clamp(1.5rem, 4.75vw, 3.75rem)",
    image: "/floor_sitting_desk.jpg",
  },
  {
    eyebrow: "SIDE TABLE",
    headline: [
      [{ text: "작은 자리까지," }],
      [{ text: "쓸모 있게", strong: true }, { text: "." }],
    ],
    desc: ["소파 옆과 침대 옆,", "필요한 공간만 정확하게 채웁니다."],
    ctaLabel: "사이드테이블 보기",
    ctaHref: "#contact",
    image: "/side_table.jpg",
  },
  {
    eyebrow: "HOME BAR TABLE",
    headline: [
      [{ text: "공간의 쓰임을," }],
      [{ text: "한 단계 " }, { text: "높이다", strong: true }, { text: "." }],
    ],
    desc: ["홈바와 작업대, 공간 분리까지", "생활 방식에 맞는 높이로 완성합니다."],
    ctaLabel: "홈바테이블 보기",
    ctaHref: "#contact",
    image: "/home_bar_table.jpg",
  },
];

function SlideContent({
  slide,
  shouldPlayVideo = true,
  isActive = true,
  skipIntroSeconds = 0,
}: {
  slide: Slide;
  shouldPlayVideo?: boolean;
  isActive?: boolean;
  /** Jumps the video forward by this many seconds on its first load, once —
   *  used on the mobile static hero to skip a slow opening beat. Not
   *  re-applied on every loop. */
  skipIntroSeconds?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSkippedIntroRef = useRef(false);

  // Pause/resume rather than unmount so far-away scrolling doesn't waste
  // bandwidth/battery on a hidden video, without reintroducing the
  // black-flash-on-unmount bug from mounting only while active.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlayVideo) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlayVideo]);

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video || hasSkippedIntroRef.current || skipIntroSeconds <= 0) return;
    video.currentTime = skipIntroSeconds;
    hasSkippedIntroRef.current = true;
  }

  return (
    <>
      {slide.video && (
        <>
          {/* Stays mounted even while sliding out — unmounting on `isActive`
              flip left a black flash during the transition-out animation. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={slide.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
          />
          {/* Gradient rather than a flat scrim: strongest behind the text at
              the bottom, clear at the top, so the footage stays visible. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </>
      )}
      {slide.image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed
              absolute-fill background, same treatment as the video above;
              next/image's layout model doesn't fit this use case. */}
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          {/* Photo subjects sit near horizontal center, so on wide viewports
              the crop can reveal a face right behind the headline — this
              left-side scrim keeps the text zone reliably dark regardless
              of what the crop shows there, instead of chasing crop math
              that shifts with every viewport width. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" />
        </>
      )}
      <div className="relative flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          {slide.eyebrow}
        </p>
        {(() => {
          // Every slide's headline stays mounted (see the black-flash note
          // above), but a page should only ever have one <h1> — only the
          // active slide gets the real heading tag; the rest render the
          // identical text/styling as a <p> so search engines and screen
          // readers see a single, correct heading structure.
          const HeadlineTag = isActive ? "h1" : "p";
          return (
            <HeadlineTag
              className="max-w-5xl font-bold leading-[1.15] tracking-[-0.03em]"
              style={{ fontSize: slide.headlineSize ?? "var(--type-hero)" }}
            >
              {slide.headline.map((line, li) => (
                <span key={li} className="block">
                  {line.map((seg, si) => (
                    <span key={si} className={seg.strong ? "font-extrabold" : undefined}>
                      {seg.text}
                    </span>
                  ))}
                </span>
              ))}
            </HeadlineTag>
          );
        })()}
        <p className="max-w-xl text-lg font-normal leading-8 text-white/70 sm:text-xl">
          {slide.desc.map((line, li) => (
            <span key={li} className="block">
              {line}
            </span>
          ))}
        </p>
        <div>
          <a
            href={slide.ctaHref}
            className="inline-flex cursor-pointer items-center gap-2 border-b border-white/50 pb-1 text-base font-medium transition-colors duration-200 hover:border-[var(--color-brand-light)] hover:text-[var(--color-brand-light)]"
          >
            {slide.ctaLabel}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </>
  );
}

function Pagination({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-8 right-6 z-10 flex flex-wrap items-center justify-end gap-3 sm:right-12 sm:gap-4">
      {slides.map((slide, i) => (
        <button
          key={slide.eyebrow}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${i + 1}번째 슬라이드: ${slide.eyebrow}`}
          aria-current={i === active}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
            i === active
              ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
              : "border-white/40 text-white/60 hover:border-white/80 hover:text-white"
          }`}
        >
          {String(i + 1).padStart(2, "0")}
        </button>
      ))}
    </div>
  );
}

/** Maps each category slide to its real product page — the slides already
 *  carried a specific CTA per category ("1인용 책상 보기" etc.) but every
 *  one pointed at the same generic in-page anchor. Real slugs, from
 *  src/lib/products.ts. */
const CATEGORY_SLUGS: Record<string, string> = {
  "ONE PERSON DESK": "single-desk",
  "TWO PERSON DESK": "double-desk",
  "FLOOR-SITTING DESK": "floor-desk",
  "SIDE TABLE": "side-table",
  "HOME BAR TABLE": "home-bar-table",
};

/** First line of a slide's headline, flattened to plain text, for the
 *  compact card treatment below (the full 2-line headline is too much
 *  copy for a card this size). */
function firstHeadlineLine(slide: Slide): string {
  return slide.headline[0].map((seg) => seg.text).join("");
}

/** Reduced-motion / mobile fallback: no scroll pinning, no scroll-jacking.
 *  Slide 1 (the general brand intro) still gets one full-height hero: it's
 *  the only slide with a video and no specific product to link to. The
 *  other five are real product categories, each with its own CTA copy that
 *  was pointing at the same generic in-page anchor — stacking five more
 *  near-identical full-screen hero blocks under it read as a slideshow that
 *  never ends rather than a brand homepage, so they're presented instead as
 *  a single, compact "browse the collection" card row, each linking to its
 *  real product page. */
function StackedSlides() {
  const [hero, ...categories] = slides;
  return (
    <>
      <section className="relative flex min-h-dvh w-full flex-col justify-end gap-6 overflow-hidden bg-[var(--color-primary)] px-6 pb-24 pt-16 text-white sm:px-12 sm:py-24">
        <SlideContent slide={hero} isActive skipIntroSeconds={2} />
      </section>

      <section className="grain relative overflow-hidden bg-[var(--color-primary)] px-6 py-16 text-white sm:px-12 sm:py-24">
        <Reveal>
          <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Our Collection
          </p>
          <h2 className="relative mt-3 max-w-md font-bold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
            공간과 쓰임에 맞는
            <br />
            다섯 가지 책상
          </h2>
        </Reveal>

        <div className="no-scrollbar relative mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {categories.map((slide, i) => (
            <Reveal key={slide.eyebrow} delay={i * 60} className="shrink-0 snap-start">
              <a
                href={`/products/${CATEGORY_SLUGS[slide.eyebrow]}/`}
                className="group relative block aspect-[3/4] w-[68vw] overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-transform duration-200 active:scale-[0.97] sm:w-[280px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-aspect card image, not a next/image layout fit. */}
                <img
                  src={slide.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                    {slide.eyebrow}
                  </p>
                  <h3 className="text-lg font-bold leading-tight tracking-[-0.01em]">
                    {firstHeadlineLine(slide)}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/80">
                    {slide.ctaLabel}
                    <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}

          <Reveal delay={categories.length * 60} className="shrink-0 snap-start">
            <a
              href="/products/"
              className="group flex aspect-[3/4] w-[68vw] flex-col items-start justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition-transform duration-200 active:scale-[0.97] sm:w-[280px]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-200 group-hover:border-white/60">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
              <span>
                <h3 className="text-lg font-bold leading-tight tracking-[-0.01em]">전체 제품 보기</h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/70">
                  인디업 전체 컬렉션
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

type PinMode = "pinned" | "after";

/** Scroll distance (in dvh) needed to advance one slide. Lower = less scrolling per slide.
 *  At 40, the *entire* 6-slide range fit inside a single strong mobile flick's
 *  scroll distance, so a hard swipe could reach the scroll position for slide
 *  6 before slide 2's crossfade had even started. 100 (a full screen height
 *  per slide) means even a hard flick's momentum is spent well before the
 *  far end of the range. */
const SCROLL_PER_SLIDE_VH = 100;

/**
 * Default: hero pins full-screen while scrolling drives which slide is shown;
 * releases once the last slide has passed.
 *
 * Uses JS-computed position: fixed/absolute switching instead of
 * `position: sticky` — sticky's "nearest scrolling ancestor" resolution is
 * fragile (any ancestor with a non-visible overflow silently breaks it), so
 * fixed positioning (always relative to the true viewport) is more robust.
 */
function PinnedSlider() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Starts "pinned" immediately: the header sits above it (z-20, opaque),
  // so there's no visual difference between "not yet reached" and "pinned"
  // for the sliver of scroll distance the sticky header already occupies —
  // waiting for rect.top to cross 0 just created a dead zone where the hero
  // visibly scrolled along with the page for that first stretch.
  const [mode, setMode] = useState<PinMode>("pinned");

  useEffect(() => {
    // A mobile flick can scroll several hundred px in a single frame — far
    // more than one slide's worth of scroll distance. Mapping the active
    // slide directly to the raw scroll fraction meant a hard flick — or
    // even a single deliberate drag, since a full-screen drag alone covers
    // close to one slide's worth of distance — could still jump straight
    // to a target several slides ahead, skipping everything in between.
    // `rawProgress` is smoothed (eased toward the true scroll fraction
    // rather than snapping to it) before it's turned into a target index,
    // so a fast drag doesn't instantly compute a far-ahead target in the
    // first place; `current` then only ever steps one slide at a time
    // toward *that*, gated to real wall-clock time so each slide's 480ms
    // crossfade (see the `duration-[480ms]` panel below) always finishes
    // before the next one starts — rAF can fire many times faster than
    // that, and stepping once per frame instead of once per interval let a
    // hard flick interrupt several crossfades in a row, which showed up as
    // two or three slides frozen mid-transition with the page background
    // visible through the gaps between them (confirmed with a real
    // headless-browser scroll-burst test).
    //
    // The mode (pinned vs. released) is read from the *raw*, un-smoothed
    // rect on every animation frame — not gated by scroll events — so it
    // can't lag behind a real device's address bar hiding/showing (which
    // doesn't reliably fire a `resize` event on every browser), and the
    // fixed-position box's own height (100dvh) stays in sync with the
    // actual viewport the moment the browser resizes it.
    const STEP_MS = 500;
    const SMOOTHING = 0.16;
    let current = 0;
    let smoothedProgress = 0;
    let rafId: number;
    let lastStepAt = 0;

    function computeRaw(): { progress: number; mode: PinMode } {
      const el = wrapperRef.current;
      if (!el) return { progress: 0, mode: "pinned" };
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;

      if (scrollable > 0 && rect.bottom <= vh) {
        return { progress: 1, mode: "after" };
      }
      const progress =
        scrollable > 0
          ? Math.min(Math.max(-rect.top / scrollable, 0), 1)
          : 0;
      return { progress, mode: "pinned" };
    }

    function loop(now: number) {
      const { progress: rawProgress, mode: newMode } = computeRaw();
      setMode(newMode);

      const diff = rawProgress - smoothedProgress;
      smoothedProgress =
        Math.abs(diff) < 0.0006 ? rawProgress : smoothedProgress + diff * SMOOTHING;

      const target =
        newMode === "after"
          ? slides.length - 1
          : Math.min(slides.length - 1, Math.floor(smoothedProgress * slides.length));

      if (current !== target && now - lastStepAt >= STEP_MS) {
        current += current < target ? 1 : -1;
        setActive(current);
        lastStepAt = now;
      }
      rafId = requestAnimationFrame(loop);
    }

    const initial = computeRaw();
    smoothedProgress = initial.progress;
    current = Math.min(slides.length - 1, Math.floor(initial.progress * slides.length));
    setActive(current);
    setMode(initial.mode);

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  function goTo(i: number) {
    const el = wrapperRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const target =
      el.offsetTop + (i / slides.length) * scrollable + scrollable * 0.02;
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  const boxStyle: CSSProperties =
    mode === "pinned"
      ? { position: "fixed", top: 0, left: 0, right: 0, height: "calc(100 * var(--vh-unit))" }
      : { position: "absolute", bottom: 0, left: 0, right: 0, height: "calc(100 * var(--vh-unit))" };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{
        height: `calc(${100 + (slides.length - 1) * SCROLL_PER_SLIDE_VH} * var(--vh-unit))`,
      }}
    >
      <div
        className="w-full overflow-hidden bg-[var(--color-primary)] text-white"
        style={boxStyle}
        aria-roledescription="carousel"
        aria-label="인디업 INDEUP 브랜드 소개 슬라이드"
      >
        {slides.map((slide, i) => {
          const offset = i < active ? -100 : i > active ? 100 : 0;
          return (
            <div
              key={slide.eyebrow}
              className="absolute inset-0 flex flex-col justify-end gap-6 px-6 py-16 transition-[transform,opacity] duration-[480ms] ease-[cubic-bezier(0.4,0,0.2,1)] sm:px-12 sm:py-24"
              style={{
                transform: `translateX(${offset}%)`,
                opacity: i === active ? 1 : 0,
              }}
              aria-hidden={i !== active}
            >
              <SlideContent
                slide={slide}
                shouldPlayVideo={Math.abs(i - active) <= 1}
                isActive={i === active}
              />
            </div>
          );
        })}
        <Pagination active={active} onSelect={goTo} />
      </div>
    </div>
  );
}

export default function HeroSlider() {
  // Default to the pinned experience (matches the common desktop case) and
  // swap to the stacked fallback for reduced-motion visitors or on mobile —
  // see useStaticFallback for why mobile gets the plain version.
  const useStatic = useStaticFallback();

  return useStatic ? <StackedSlides /> : <PinnedSlider />;
}
