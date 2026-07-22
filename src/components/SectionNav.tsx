"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "소개" },
  { id: "who-we-are", label: "어떤 브랜드인가" },
  { id: "maker-seller", label: "제조와 판매" },
  { id: "made-to-fit", label: "10mm 맞춤" },
  { id: "our-standard", label: "품질 기준" },
  { id: "how-we-make", label: "제작 과정" },
  { id: "official-brand", label: "공식 브랜드" },
  { id: "our-collection", label: "제품 구성" },
  { id: "our-principle", label: "브랜드 철학" },
  { id: "experience", label: "사용 경험" },
  { id: "channels", label: "공식 채널" },
  { id: "faq", label: "자주 묻는 질문" },
];

/** Floating glass dot-rail for wayfinding on this long page — tracks which
 * section is centered in view via IntersectionObserver and lets a visitor
 * jump straight to any section. Desktop-only (xl+): on narrower viewports
 * there isn't reliable room for a fixed side element that won't overlap
 * content. */
export default function SectionNav() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    const els = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="페이지 내 섹션 이동"
      className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 xl:block"
    >
      <div className="flex flex-col items-center gap-2.5 rounded-full bg-white/80 px-2.5 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.04] backdrop-blur-md">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            title={s.label}
            aria-label={s.label}
            aria-current={active === s.id ? "true" : undefined}
            className="group flex h-3 w-3 cursor-pointer items-center justify-center"
          >
            <span
              className={`rounded-full transition-all duration-300 ${
                active === s.id
                  ? "h-2.5 w-2.5 bg-[var(--color-brand)]"
                  : "h-1.5 w-1.5 bg-[var(--color-primary)]/25 group-hover:bg-[var(--color-primary)]/50"
              }`}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
