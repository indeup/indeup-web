"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Fades and slides content in once it scrolls into view. Respects prefers-reduced-motion via the global CSS override. */
export default function Reveal({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  /** Optional entrance delay in ms — lets a group of siblings cascade in instead of arriving all at once. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Positive bottom margin so the reveal starts while the element is still
    // below the viewport, not after it's already scrolled into view — a fast
    // downward flick on mobile could otherwise outrun the 700ms transition
    // and show a blank gap where the section should already be visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
