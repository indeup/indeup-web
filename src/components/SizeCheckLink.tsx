"use client";

import { useSearchParams } from "next/navigation";

/**
 * Forwards a ?width=&depth=&height= recommendation on to /custom-fit/, so the
 * confirmation prompt there still works after an extra hop through this
 * product page — 책상가이드 → 추천 사이즈 제품 확인하기 (this page) → 사이즈
 * 제작 가능 여부 확인 (/custom-fit/), not just 책상가이드 → /custom-fit/
 * directly. Falls back to a plain /custom-fit/ link when nothing was carried
 * over (e.g. a visitor who landed on this product page any other way).
 */
export default function SizeCheckLink({ className }: { className: string }) {
  const searchParams = useSearchParams();
  const width = searchParams.get("width");
  const depth = searchParams.get("depth");
  const height = searchParams.get("height");
  const href = width && depth && height ? `/custom-fit/?width=${width}&depth=${depth}&height=${height}` : "/custom-fit/";

  return (
    <a href={href} className={className}>
      사이즈 제작 가능 여부 확인
    </a>
  );
}
