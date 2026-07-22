"use client";

import { useRef, useState } from "react";

export default function DimensionShowcase() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleMuted() {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  }

  return (
    <section id="custom" className="bg-[var(--color-primary)] px-6 py-20 text-white sm:px-12 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/50">
              <span className="text-[var(--color-brand-light)]">02</span> · 맞춤 제작
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl">
              공간에 맞는 책상은
              <br />
              가로·세로·높이부터 달라야 합니다.
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-white/70 sm:text-lg">
              인디업은 정해진 규격에 공간을 맞추지 않습니다.
              <br />
              사용할 자리와 장비, 생활 방식에 맞춰
              <br />
              가로·세로·높이를 세밀하게 조정해 제작합니다.
            </p>
            <a
              href="/custom-fit/"
              className="group mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition-colors duration-200 hover:bg-white/85"
            >
              내 사이즈 제작 가능한지 확인하기
              <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>

        <div
          className="relative mt-14 w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio: "16 / 7" }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/width.mp4"
            autoPlay
            muted={muted}
            loop
            playsInline
          />
          <span className="absolute bottom-6 left-6 rounded-full bg-black/60 px-4 py-2 text-sm font-medium backdrop-blur-sm sm:bottom-8 sm:left-8">
            10mm 단위 맞춤 제작
          </span>

          <button
            type="button"
            onClick={toggleMuted}
            aria-label={muted ? "영상 소리 켜기" : "영상 소리 끄기"}
            aria-pressed={!muted}
            className="absolute bottom-6 right-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105 sm:bottom-8 sm:right-8"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="4 9 9 9 13 5 13 19 9 15 4 15 4 9" />
                <line x1="17" y1="9" x2="22" y2="14" />
                <line x1="22" y1="9" x2="17" y2="14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="4 9 9 9 13 5 13 19 9 15 4 15 4 9" />
                <path d="M17 8a5 5 0 0 1 0 8" />
                <path d="M19.5 5.5a9 9 0 0 1 0 13" />
              </svg>
            )}
            {muted ? "소리 켜기" : "소리 끄기"}
          </button>
        </div>
      </div>
    </section>
  );
}
