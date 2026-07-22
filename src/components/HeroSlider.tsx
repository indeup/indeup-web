"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
    headlineSize: "clamp(2.5rem, 6.25vw, 5rem)",
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
    headlineSize: "clamp(2rem, 4.75vw, 3.75rem)",
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
}: {
  slide: Slide;
  shouldPlayVideo?: boolean;
  isActive?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

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

/** Reduced-motion fallback: each slide is its own normal full-height section, no scroll pinning. */
function StackedSlides() {
  return (
    <>
      {slides.map((slide, i) => (
        <section
          key={slide.eyebrow}
          className="relative flex min-h-dvh w-full flex-col justify-end gap-6 overflow-hidden bg-[var(--color-primary)] px-6 py-16 text-white sm:px-12 sm:py-24"
        >
          <SlideContent slide={slide} isActive={i === 0} />
        </section>
      ))}
    </>
  );
}

type PinMode = "pinned" | "after";

/** Scroll distance (in dvh) needed to advance one slide. Lower = less scrolling per slide. */
const SCROLL_PER_SLIDE_VH = 40;

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
    function update() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = rect.height - vh;

      if (scrollable > 0 && rect.bottom <= vh) {
        setMode("after");
        setActive(slides.length - 1);
      } else {
        setMode("pinned");
        const progress =
          scrollable > 0
            ? Math.min(Math.max(-rect.top / scrollable, 0), 1)
            : 0;
        setActive(
          Math.min(slides.length - 1, Math.floor(progress * slides.length))
        );
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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
      ? { position: "fixed", top: 0, left: 0, right: 0, height: "100dvh" }
      : { position: "absolute", bottom: 0, left: 0, right: 0, height: "100dvh" };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{
        height: `${100 + (slides.length - 1) * SCROLL_PER_SLIDE_VH}dvh`,
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
              className="absolute inset-0 flex flex-col justify-end gap-6 px-6 py-16 transition-[transform,opacity] duration-[1600ms] ease-[cubic-bezier(0.4,0,0.2,1)] sm:px-12 sm:py-24"
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
  // Default to the pinned experience (matches the common case) and swap to
  // the stacked fallback only once we detect a reduced-motion preference.
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return reducedMotion ? <StackedSlides /> : <PinnedSlider />;
}
