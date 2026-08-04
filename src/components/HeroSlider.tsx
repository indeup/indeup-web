"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import DesktopHeroVideo from "@/components/DesktopHeroVideo";
import BrandWordmarkStatement from "@/components/BrandWordmarkStatement";

type HeadlineSegment = { text: string; strong?: boolean };

type Slide = {
  eyebrow: string;
  /** Plain-Korean product name (e.g. "1인용 책상") shown ahead of the
   *  stylized English eyebrow on mobile, so a visitor scanning quickly
   *  doesn't have to parse the English label to know what the slide is
   *  about. Not set on the brand-intro slide, which has no single product. */
  koreanLabel?: string;
  /** Each entry is one forced line (max 2 lines per the design spec); each line is a list of segments so a key word can be emphasized. */
  headline: HeadlineSegment[][];
  /** Each entry is one forced line (max 2 lines). */
  desc: string[];
  ctaLabel: string;
  ctaHref: string;
  video?: string;
  image?: string;
  /** Most product photos are near-square, shot for a taller frame than this
   *  very wide hero band ends up showing — a plain center crop can clip the
   *  desk or a face depending on where the subject sits in that particular
   *  photo. Overrides the default `object-position: 50% 50%` per slide. */
  imagePosition?: string;
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
  },
  {
    eyebrow: "ONE PERSON DESK",
    koreanLabel: "1인용 책상",
    headline: [
      [{ text: "한 사람의 공간을," }],
      [{ text: "더 " }, { text: "정확하게", strong: true }, { text: "." }],
    ],
    desc: ["작은 방부터 홈오피스까지,", "사용하는 자리와 방식에 맞춰 제작합니다."],
    ctaLabel: "1인용 책상 보기",
    ctaHref: "#contact",
    image: "/desk_select.jpg",
  },
  {
    eyebrow: "SINGLE DESK · COMPUTER",
    koreanLabel: "1인용 컴퓨터책상",
    headline: [
      [{ text: "컴퓨터도, 모니터암도," }],
      [{ text: "자리 " }, { text: "그대로", strong: true }, { text: "." }],
    ],
    desc: ["멀티탭거치대가 기본 포함된 컴퓨터책상,", "18mm 상판에 모니터암도 바로 설치할 수 있습니다."],
    ctaLabel: "1인용 컴퓨터책상 보기",
    ctaHref: "#contact",
    image: "/one_person_desk.jpg",
  },
  {
    eyebrow: "TWO PERSON DESK",
    koreanLabel: "2인용 책상",
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
    eyebrow: "DOUBLE DESK · COMPUTER",
    koreanLabel: "2인용 컴퓨터책상",
    headline: [
      [{ text: "둘이 함께 앉아도," }],
      [{ text: "각자의 " }, { text: "컴퓨터", strong: true }, { text: " 자리를." }],
    ],
    desc: ["멀티탭거치대 2개가 기본 포함된 컴퓨터책상,", "두 사람 모두 전선 걱정 없이 씁니다."],
    ctaLabel: "2인용 컴퓨터책상 보기",
    ctaHref: "#contact",
    image: "/two_desk_select.jpg",
    imagePosition: "50% 62%",
  },
  {
    eyebrow: "FLOOR-SITTING DESK",
    koreanLabel: "좌식 책상",
    headline: [
      [{ text: "낮게 앉아도," }],
      [{ text: "책상의 기준은 " }, { text: "낮추지 않습니다", strong: true }, { text: "." }],
    ],
    desc: ["좌식 생활에 맞는 높이와", "흔들림을 줄인 묵직한 구조로 제작합니다."],
    ctaLabel: "좌식 책상 보기",
    ctaHref: "#contact",
    image: "/floor_sitting_desk.jpg",
  },
  {
    eyebrow: "SIDE TABLE",
    koreanLabel: "사이드테이블",
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
    koreanLabel: "홈바테이블",
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
  showKoreanLabel = false,
}: {
  slide: Slide;
  shouldPlayVideo?: boolean;
  isActive?: boolean;
  /** Jumps the video forward by this many seconds on its first load, once —
   *  used on the mobile static hero to skip a slow opening beat. Not
   *  re-applied on every loop. */
  skipIntroSeconds?: number;
  /** Shows the plain-Korean product name above the stylized English eyebrow
   *  — used on the mobile hero carousel so a quick swipe-through reads the
   *  product name immediately, without waiting on the full headline copy. */
  showKoreanLabel?: boolean;
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
            // A real still frame of the video's first shot, not a placeholder —
            // shows instantly (a few KB) while the ~16MB mp4 is still
            // downloading, instead of leaving the very first thing a visitor
            // sees as blank. Also gives the browser an actual LCP (Largest
            // Contentful Paint) candidate for this above-the-fold hero region.
            poster="/indeup-hero-poster.jpg"
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
            alt={slide.koreanLabel ? `인디업 ${slide.koreanLabel}` : slide.eyebrow}
            className="absolute inset-0 h-full w-full object-cover"
            style={slide.imagePosition ? { objectPosition: slide.imagePosition } : undefined}
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
        <div>
          {showKoreanLabel && slide.koreanLabel && (
            <p className="text-base font-semibold tracking-[-0.01em] text-white">{slide.koreanLabel}</p>
          )}
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            {slide.eyebrow}
          </p>
        </div>
        {(() => {
          // Every slide's headline stays mounted (see the black-flash note
          // above), but a page should only ever have one <h1> — only the
          // active slide gets the real heading tag; the rest render the
          // identical text/styling as a <p> so search engines and screen
          // readers see a single, correct heading structure.
          const HeadlineTag = isActive ? "h1" : "p";
          return (
            <HeadlineTag
              className="max-w-5xl font-semibold leading-[1.15] tracking-[-0.02em]"
              style={{ fontSize: slide.headlineSize ?? "var(--type-hero)" }}
            >
              {slide.headline.map((line, li) => (
                <span key={li} className="block">
                  {line.map((seg, si) => (
                    <span key={si}>{seg.text}</span>
                  ))}
                </span>
              ))}
            </HeadlineTag>
          );
        })()}
        <p className="max-w-xl text-lg font-medium leading-[1.3] text-white/70 sm:text-xl">
          {slide.desc.map((line, li) => (
            <span key={li} className="block">
              {line}
            </span>
          ))}
        </p>
        <div>
          <a
            href={slide.ctaHref}
            className="inline-flex cursor-pointer items-center gap-2 border-b border-white/50 pb-1 text-base font-medium transition-colors duration-200 hover:border-white hover:text-white"
          >
            {slide.ctaLabel}
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </>
  );
}

/** Maps each category slide to its real product page — the slides already
 *  carried a specific CTA per category ("1인용 책상 보기" etc.) but every
 *  one pointed at the same generic in-page anchor. Real slugs, from
 *  src/lib/products.ts. */
const CATEGORY_SLUGS: Record<string, string> = {
  "ONE PERSON DESK": "single-desk",
  "SINGLE DESK · COMPUTER": "single-desk-computer",
  "TWO PERSON DESK": "double-desk",
  "DOUBLE DESK · COMPUTER": "double-desk-computer",
  "FLOOR-SITTING DESK": "floor-desk",
  "SIDE TABLE": "side-table",
  "HOME BAR TABLE": "home-bar-table",
};

/** Small round pagination dots for the mobile hero carousel — visually
 *  distinct from the desktop pinned slider's numbered squares (Pagination
 *  above), which are too heavy a footprint for a phone-width strip of 8. */
function HeroDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${i + 1}번째 슬라이드로 이동`}
          aria-current={i === active}
          className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
            i === active ? "w-6 bg-white" : "w-2 bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

const AUTOPLAY_MS = 5000;

/** The hero, on every viewport: a real swipeable/auto-rotating carousel
 *  (CSS scroll-snap) instead of a scroll-jacked pin — no screen transition
 *  is tied to the visitor's own scroll input. IntersectionObserver (not
 *  scroll math) tracks which slide is active for the dots and autoplay.
 *  Autoplay is disabled under prefers-reduced-motion and stops permanently
 *  the moment the visitor swipes, drags, or taps a dot, matching how
 *  they'd expect to keep the control they just took. */
function MobileHeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  // Header.tsx is `sticky top-0`, so it occupies real space in normal flow
  // above the hero rather than overlaying it — sizing each slide to a flat
  // 100dvh then runs exactly the header's height past the bottom of the
  // visible viewport, pushing the pagination dots below the fold. Measuring
  // the header's actual rendered height (rather than hardcoding a guessed
  // px value that would silently drift out of sync with any future header
  // edit) and subtracting it keeps the whole slide — dots included —
  // inside the space actually visible below the header.
  const [slideHeight, setSlideHeight] = useState("100dvh");

  useEffect(() => {
    function updateHeight() {
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      // Desktop keeps a shorter, banner-like proportion (closer to how a
      // reference site's own promo banner reads) instead of claiming the
      // full viewport — only mobile still uses the full available height.
      const targetVh = window.innerWidth >= 640 ? "70dvh" : "100dvh";
      setSlideHeight(`calc(${targetVh} - ${headerHeight}px)`);
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // A batch can (and did, during initial layout before scroll-snap
        // settles) report more than one slide as "intersecting" at once —
        // blindly setting active on every entry in the batch meant whichever
        // one happened to be last in the array won, regardless of how much
        // of it was actually visible. Only the single most-visible entry in
        // this batch should ever become the active slide.
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
        }
        if (best && best.intersectionRatio > 0.5) {
          setActive(Number((best.target as HTMLElement).dataset.slideIndex));
        }
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // `Element.scrollIntoView()` scrolls *every* ancestor scroll container
  // into view, not just this horizontal track — including the outer page
  // itself. Once a visitor had scrolled past the hero, an autoplay tick
  // would silently yank the whole page back up to re-reveal it. Scrolling
  // the track's own `scrollLeft` directly touches only the carousel, never
  // the page.
  function scrollToSlide(i: number) {
    const track = trackRef.current;
    const target = slideRefs.current[i];
    if (!track || !target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      scrollToSlide((active + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active]);

  function goTo(i: number) {
    pausedRef.current = true;
    scrollToSlide(i);
  }

  return (
    <section className="relative">
      <div
        ref={trackRef}
        onPointerDown={() => {
          pausedRef.current = true;
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        aria-roledescription="carousel"
        aria-label="인디업 INDEUP 브랜드 소개 슬라이드"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.eyebrow}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-slide-index={i}
            style={{ height: slideHeight }}
            className="relative flex w-full shrink-0 snap-start snap-always flex-col justify-end gap-6 overflow-hidden bg-[var(--color-primary)] px-6 pb-24 pt-16 text-white"
          >
            <SlideContent
              slide={slide}
              isActive={i === active}
              shouldPlayVideo={Math.abs(i - active) <= 1}
              skipIntroSeconds={i === 0 ? 2 : 0}
              showKoreanLabel
            />
          </div>
        ))}
      </div>
      <HeroDots count={slides.length} active={active} onSelect={goTo} />
    </section>
  );
}

/** Compact quick-nav grid under the hero carousel — the carousel above
 *  already gives every product its own full-screen spotlight (photo,
 *  headline, CTA), so a second row of near-identical large cards repeating
 *  the same copy just doubled scroll length without adding information.
 *  This is a fast "jump straight to a category" reference instead: square
 *  thumbnail + plain Korean name, nothing else competing for attention. */
export function CollectionQuickNav() {
  const categories = slides.slice(1);
  return (
    <section className="relative mx-3 overflow-hidden bg-white px-6 py-10 text-[var(--color-primary)] sm:mx-0 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            Our Collection
          </p>
          <h2 className="relative mt-3 max-w-md font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: "var(--type-h2)" }}>
            공간과 쓰임에 맞는
            <br />
            일곱 가지 책상
          </h2>
        </Reveal>

        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((slide, i) => (
            <Reveal key={slide.eyebrow} delay={i * 60}>
              <a
                href={`/products/${CATEGORY_SLUGS[slide.eyebrow]}/`}
                className="group relative block aspect-square overflow-hidden rounded-2xl transition-transform duration-200 active:scale-[0.97]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-aspect thumbnail, not a next/image layout fit. */}
                <img
                  src={slide.image}
                  alt={slide.koreanLabel ? `인디업 ${slide.koreanLabel}` : slide.eyebrow}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <p className="text-sm font-semibold leading-tight text-white">{slide.koreanLabel}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={categories.length * 60} className="mt-4">
          <Link
            href="/products/"
            className="group flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors duration-200 hover:border-[var(--color-primary)]/50"
          >
            전체 제품 보기
            <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function HeroSlider() {
  return (
    <>
      {/* Mobile keeps the existing swipeable multi-slide carousel exactly as
          it was — hidden from `sm` up. Desktop gets a dedicated full-screen
          video-only hero instead (no slide cycling); the same product
          photos aren't gone, they still appear just below in
          CollectionQuickNav. */}
      <div className="sm:hidden">
        <MobileHeroCarousel />
      </div>
      <DesktopHeroVideo />
      <BrandWordmarkStatement />
    </>
  );
}
