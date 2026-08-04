"use client";

import { useEffect, useRef, useState } from "react";
import { markHeroVideoReady } from "@/lib/heroVideoReady";

/** Desktop-only, full-screen video hero — no slide cycling, no photo slides,
 *  just the brand video full-bleed with text overlaid on top (matching a
 *  reference site's own full-screen video hero treatment). The product-photo
 *  slides that used to share this same carousel on desktop aren't gone —
 *  they still show right below, in CollectionQuickNav (see HeroSlider.tsx).
 *  Mobile keeps its existing swipeable carousel untouched; this component is
 *  hidden below the `sm` breakpoint. */
export default function DesktopHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Header.tsx is `sticky top-0`, occupying real space above this section
  // rather than overlaying it — a flat 100dvh here runs exactly the header's
  // height past the bottom of the visible viewport (the "화면이 아래가 더
  // 길게 나온다" report). Same fix already used on the mobile carousel:
  // measure the header's real rendered height and subtract it.
  const [heroHeight, setHeroHeight] = useState("100dvh");

  useEffect(() => {
    function updateHeight() {
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      setHeroHeight(`calc(100dvh - ${headerHeight}px)`);
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    // Covers the case where the browser already has the video fully cached
    // (readyState is HAVE_ENOUGH_DATA before this component's onCanPlayThrough
    // handler is even attached) — canplaythrough won't fire again in that case.
    if ((videoRef.current?.readyState ?? 0) >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      markHeroVideoReady();
    }
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section
      className="relative hidden w-full overflow-hidden bg-[var(--color-primary)] sm:block"
      style={{ height: heroHeight }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/indeup-hero-desk.mp4"
        poster="/indeup-hero-desk-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={markHeroVideoReady}
      />
      {/* Gradient rather than a flat scrim: strongest behind the text at the
          bottom, clear at the top, so the footage stays visible. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "영상 소리 켜기" : "영상 소리 끄기"}
        className="absolute left-8 top-8 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-black/40"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M18.36 5.64a9 9 0 0 1 0 12.73" />
          </svg>
        )}
      </button>

      <div className="relative flex h-full flex-col justify-end px-12 pb-24">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
            MADE TO FIT YOUR SPACE
          </p>
          {/* Not an <h1> on purpose — MobileHeroCarousel's active slide (see
              SlideContent in HeroSlider.tsx) already owns the page's single
              real <h1> with this exact same copy. Both hero variants stay
              mounted at all times (toggled by CSS breakpoint, not removed
              from the DOM), so a second <h1> here would give crawlers two
              H1s on one page — a real, tool-confirmed duplicate-heading
              defect, not a false positive. */}
          <p className="max-w-3xl text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            <span className="block">공간을 재는 순간,</span>
            <span className="block">
              책상은 <span className="font-bold">달라져야</span> 합니다.
            </span>
          </p>
          <p className="max-w-xl text-lg font-medium leading-[1.3] text-white/70 sm:text-xl">
            <span className="block">줄자로 잰 사이즈 그대로,</span>
            <span className="block">인디업이 당신의 공간에 맞춰 제작합니다.</span>
          </p>
          <div>
            <a
              href="#process"
              className="inline-flex cursor-pointer items-center gap-2 border-b border-white/50 pb-1 text-base font-medium text-white/90 transition-colors duration-200 hover:border-white hover:text-white"
            >
              인디업 알아보기
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Brand-style scroll cue: a slim pill outline with a dot easing down
          inside it (the classic "scroll mouse" glyph), rather than plain
          "Scroll down" text. */}
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
        <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/50 p-1.5">
          <span className="h-1.5 w-1.5 animate-scroll-cue rounded-full bg-white" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">Scroll</span>
      </div>
    </section>
  );
}
