"use client";

import { useEffect, useRef, useState } from "react";

const reelUrls = [
  "https://www.instagram.com/reel/DbAmphloKkw/",
  "https://www.instagram.com/reel/Darx3TtzTeo/",
  "https://www.instagram.com/reel/DZ1aIJ6I970/",
];

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "이전 릴스" : "다음 릴스"}
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition-transform duration-200 hover:scale-110 hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-border)] disabled:hover:scale-100"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

export default function InstagramReels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    function process() {
      window.instgrm?.Embeds.process();
    }

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", process);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    function update() {
      if (!scroller) return;
      setAtStart(scroller.scrollLeft <= 2);
      setAtEnd(scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2);
    }
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollByCard(dir: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = (firstCardRef.current?.offsetWidth ?? 340) + 24;
    scroller.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <section className="border-b border-[var(--color-border)] px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
          @indeup.kr
        </p>
        <h2
          className="mt-4 font-bold tracking-[-0.02em]"
          style={{ fontSize: "var(--type-h2)" }}
        >
          인스타그램에서도 확인하세요.
        </h2>
        <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
          본 영상의 일부 장면은 AI 기술로 생성·편집되었습니다.
        </p>

        <div
          ref={scrollerRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
        >
          {reelUrls.map((url, i) => (
            <div
              key={url}
              ref={i === 0 ? firstCardRef : undefined}
              className="w-[85vw] shrink-0 snap-start overflow-hidden border border-[var(--color-border)] sm:w-[340px]"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: 0,
                  boxShadow: "none",
                  margin: 0,
                  maxWidth: 340,
                  minWidth: 326,
                  padding: 0,
                  width: "100%",
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", padding: 24, textAlign: "center" }}
                >
                  인디업 릴스 보기
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <ArrowButton direction="left" onClick={() => scrollByCard(-1)} disabled={atStart} />
          <ArrowButton direction="right" onClick={() => scrollByCard(1)} disabled={atEnd} />
        </div>
      </div>
    </section>
  );
}
