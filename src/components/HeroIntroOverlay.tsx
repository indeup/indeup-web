"use client";

import { useEffect, useState } from "react";
import { Red_Hat_Display } from "next/font/google";
import { onHeroVideoReady } from "@/lib/heroVideoReady";

// Same wordmark treatment as BrandWordmarkStatement.tsx (caption line, then
// the brand name set huge in Red Hat Display) — reused here so the intro
// and the section right below the video hero read as one consistent brand
// moment instead of two different typographic treatments.
const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-redhat-intro",
});

// Always visible for at least this long, even on a warm cache where the
// video/images are ready almost instantly — a flash-and-gone intro reads as
// a bug, not a brand moment.
const MIN_DURATION_MS = 2800;
// Safety valve: proceed anyway even if the video/images never signal ready
// (flaky connection, blocked request, etc.) — trapping the visitor on the
// intro forever is worse than revealing a still-buffering hero.
const MAX_DURATION_MS = 8000;
const FADE_MS = 600;

export default function HeroIntroOverlay() {
  // Starts true (not false) on purpose: this is a static export with no
  // server render step, so whatever the initial state is here is what's in
  // the HTML the browser paints first. Starting at false let the actual
  // homepage flash through underneath for one frame before the effect below
  // ever ran — the intro has to already be up in that very first paint.
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    let minElapsed = false;
    let assetsReady = false;
    let settled = false;

    function finish() {
      if (settled) return;
      settled = true;
      setFadingOut(true);
      setTimeout(() => setVisible(false), FADE_MS);
    }

    function tryFinish() {
      if (minElapsed && assetsReady) finish();
    }

    const minTimer = setTimeout(() => {
      minElapsed = true;
      tryFinish();
    }, MIN_DURATION_MS);
    const maxTimer = setTimeout(finish, MAX_DURATION_MS);

    function onAssetsReady() {
      assetsReady = true;
      tryFinish();
    }

    // window "load" only fires once every image/resource requested by the
    // initial page has finished downloading — exactly "사진들이 다
    // 다운로드가 되서". The hero video is tracked separately (see
    // heroVideoReady.ts) since <video> loading isn't part of that event.
    let videoReady = false;
    let pageReady = document.readyState === "complete";
    function checkAssetsReady() {
      if (videoReady && pageReady) onAssetsReady();
    }
    const unsubscribeVideo = onHeroVideoReady(() => {
      videoReady = true;
      checkAssetsReady();
    });
    function onWindowLoad() {
      pageReady = true;
      checkAssetsReady();
    }
    if (!pageReady) window.addEventListener("load", onWindowLoad);
    else checkAssetsReady();

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener("load", onWindowLoad);
      unsubscribeVideo();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`${redHatDisplay.variable} fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white px-6 text-center transition-opacity ease-out ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <p
        className="overflow-hidden font-medium text-[var(--color-primary)]"
        style={{ fontSize: "clamp(1.25rem, 1.667vw, 2rem)" }}
      >
        <span className="animate-intro-reveal block">10mm 단위의 정밀함으로, 공간에 꼭 맞는 책상을 만듭니다.</span>
      </p>
      <p
        className="mt-[20px] overflow-hidden px-2 leading-[1.525] text-[var(--color-primary)]"
        style={{
          fontFamily: "var(--font-redhat-intro), var(--font-pretendard), sans-serif",
          fontWeight: 500,
          fontSize: "clamp(2.5rem, 6.25vw, 7.5rem)",
          letterSpacing: "-0.0533em",
        }}
      >
        <span className="animate-intro-reveal block" style={{ animationDelay: "150ms" }}>
          인디업 INDEUP<span className="align-super text-[0.35em]">&reg;</span>
        </span>
      </p>
    </div>
  );
}
