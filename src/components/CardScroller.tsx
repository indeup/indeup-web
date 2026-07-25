"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Arrow button glyphs, shared by both edges. */
function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

const EDGE_FADE_PX = 36;

/** Fades the strip's own left/right edges to transparent — only on whichever side still has more to scroll — instead of clipping cards off with a hard edge. */
function buildEdgeMask(canLeft: boolean, canRight: boolean): string {
  const left = canLeft ? `transparent 0%, black ${EDGE_FADE_PX}px` : "black 0%";
  const right = canRight ? `black calc(100% - ${EDGE_FADE_PX}px), transparent 100%` : "black 100%";
  return `linear-gradient(to right, ${left}, ${right})`;
}

/**
 * A single-row, horizontally scrollable card strip (scroll-snap + arrow
 * buttons) instead of a tall multi-row grid — keeps each content section to
 * one visual band regardless of how many items exist.
 *
 * Scrolling itself is entirely native (touch swipe, trackpad, shift+wheel,
 * or the arrow buttons) — a hand-rolled mouse-drag-to-scroll was tried here
 * and removed: its click-vs-drag heuristics kept swallowing ordinary clicks
 * on the cards, which matters more than the extra desktop-mouse convenience.
 *
 * Every card stays fully readable at rest (image + title always clear) —
 * an earlier version dimmed every card except the "leading" one, which read
 * as broken/too dark at a glance. Cards handle their own hover state
 * individually. Edges fade instead of clipping cards off hard, a thin bar
 * below tracks scroll position, and a brief one-time nudge on mount hints
 * that it's scrollable.
 */
export default function CardScroller<T>({
  items,
  renderItem,
  keyFor,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyFor: (item: T) => string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hintOffset, setHintOffset] = useState(0);
  const [scrollThumb, setScrollThumb] = useState({ left: 0, width: 100 });
  // The left/right fade reads as a helpful "there's more" hint on desktop,
  // where the arrow buttons live right next to it — but on a narrow mobile
  // screen it just dims the first/last card's edge for no clear reason,
  // which read as a cheap gaussian-blur artifact rather than an affordance.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    const trackable = el.scrollWidth - el.clientWidth;
    setScrollThumb({
      width: Math.max(12, (el.clientWidth / el.scrollWidth) * 100),
      left: trackable > 0 ? (el.scrollLeft / trackable) * (100 - (el.clientWidth / el.scrollWidth) * 100) : 0,
    });
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // One-time "there's more" nudge shortly after the strip first has content
  // — a small visual shift-and-return, not an actual scroll, so it never
  // fights scroll-snap or the user's own scroll position.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 8) return;
    const nudgeOut = setTimeout(() => setHintOffset(-28), 700);
    const nudgeBack = setTimeout(() => setHintOffset(0), 1150);
    return () => {
      clearTimeout(nudgeOut);
      clearTimeout(nudgeBack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  function scrollByOneCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    const firstItem = itemRefs.current[0];
    if (!el || !firstItem) return;
    const gapPx = parseFloat(getComputedStyle(el).columnGap || "0");
    const step = firstItem.getBoundingClientRect().width + gapPx;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const showThumb = canScrollLeft || canScrollRight;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-1"
        style={{
          transform: `translateX(${hintOffset}px)`,
          transition: "transform 450ms ease-out",
          WebkitMaskImage: isDesktop ? buildEdgeMask(canScrollLeft, canScrollRight) : "none",
          maskImage: isDesktop ? buildEdgeMask(canScrollLeft, canScrollRight) : "none",
        }}
      >
        {items.map((item, i) => (
          <div
            key={keyFor(item)}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            className="shrink-0 snap-start basis-[85%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByOneCard(-1)}
          aria-label="이전 카드 보기"
          className="absolute left-0 top-1/2 -ml-4 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:border-[var(--color-primary)] sm:flex"
        >
          <ArrowIcon direction="left" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByOneCard(1)}
          aria-label="다음 카드 보기"
          className="absolute right-0 top-1/2 -mr-4 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:border-[var(--color-primary)] sm:flex"
        >
          <ArrowIcon direction="right" />
        </button>
      )}

      {showThumb && (
        <div className="relative mx-1 mt-5 h-[3px] overflow-hidden rounded-full bg-[var(--color-border)]" aria-hidden="true">
          <div
            className="absolute top-0 h-full rounded-full bg-[var(--color-primary)] transition-[left] duration-150 ease-out"
            style={{ width: `${scrollThumb.width}%`, left: `${scrollThumb.left}%` }}
          />
        </div>
      )}
    </div>
  );
}
