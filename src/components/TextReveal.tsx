"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Word-by-word "wipe up" reveal, triggered once on scroll into view.
 * Each word is masked by an overflow-hidden wrapper and slides up from
 * below it with a short per-word stagger (capped so long paragraphs
 * don't take forever to finish). Optionally highlights matching words
 * (e.g. the brand name) in the brand accent color.
 */
export default function TextReveal({
  text,
  className,
  highlight,
}: {
  text: string;
  className?: string;
  highlight?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlight ? word.includes(highlight) : false;
        return (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.2em] align-bottom">
              <span
                className={`inline-block transition-transform duration-[600ms] ease-out will-change-transform ${
                  isHighlight ? "font-bold text-[var(--color-brand)]" : ""
                }`}
                style={{
                  transitionDelay: `${Math.min(i * 24, 480)}ms`,
                  transform: visible ? "translateY(0%)" : "translateY(115%)",
                }}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
