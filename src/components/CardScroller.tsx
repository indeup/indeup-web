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
 * The leading (leftmost) visible card stays at full brightness as the
 * "now viewing" slot; every other visible card dims. Edges fade instead of
 * clipping cards off hard, a thin bar below tracks scroll position, and a
 * brief one-time nudge on mount hints that it's scrollable.
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [hintOffset, setHintOffset] = useState(0);
  const [scrollThumb, setScrollThumb] = useState({ left: 0, width: 100 });

  function findLeadingIndex(): number {
    const el = scrollerRef.current;
    if (!el) return 0;
    const containerLeft = el.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDist = Infinity;
    itemRefs.current.forEach((node, i) => {
      if (!node) return;
      const dist = Math.abs(node.getBoundingClientRect().left - containerLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    return closestIndex;
  }

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

  function handleScroll() {
    updateScrollState();
    setActiveIndex(findLeadingIndex());
  }

  useEffect(() => {
    handleScroll();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
          WebkitMaskImage: buildEdgeMask(canScrollLeft, canScrollRight),
          maskImage: buildEdgeMask(canScrollLeft, canScrollRight),
        }}
      >
        {items.map((item, i) => (
          <div
            key={keyFor(item)}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            className={`shrink-0 snap-start basis-[85%] transition-all duration-300 ease-out hover:brightness-100 sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] ${
              i === activeIndex ? "scale-100 brightness-100" : "scale-[0.96] brightness-[0.4]"
            }`}
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
