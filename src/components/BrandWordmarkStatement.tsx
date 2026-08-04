import Link from "next/link";
import { Red_Hat_Display } from "next/font/google";

// Measured directly off the reference site's own wordmark (getComputedStyle
// on its live H3): font-family Red Hat Display, weight 500 (medium, not
// black — it only reads as bold because of the typeface's own display-cut),
// font-size 120px at a 1920px viewport (~6.25vw), letter-spacing -6.4px
// (~-0.0533em). Korean falls back to Pretendard (already loaded site-wide)
// since Red Hat Display has no Hangul glyphs — same fallback chain the
// reference site itself uses.
const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-redhat",
});

/** Brand statement — small caption line, then the brand name set huge, the
 *  same "quiet line, then a giant wordmark" rhythm as the reference site.
 *  On desktop this sits directly under the full-screen video hero (see
 *  DesktopHeroVideo.tsx); on mobile it sits under the existing photo
 *  carousel (MobileHeroCarousel), with much lighter top/bottom padding —
 *  the desktop 280px/160px figures were measured off a 1920px reference
 *  layout and would read as mostly-empty white space on a 390px screen. */
export default function BrandWordmarkStatement() {
  return (
    <section className={`${redHatDisplay.variable} bg-white px-6 pt-16 pb-12 text-center sm:px-12 sm:pt-[280px] sm:pb-[160px]`}>
      <p
        className="font-medium text-[var(--color-primary)]"
        style={{ fontSize: "clamp(1.25rem, 1.667vw, 2rem)" }}
      >
        10mm 단위의 정밀함으로, 공간에 꼭 맞는 책상을 만듭니다.
      </p>
      <p
        className="mt-[20px] leading-[1.525] text-[var(--color-primary)]"
        style={{
          fontFamily: "var(--font-redhat), var(--font-pretendard), sans-serif",
          fontWeight: 500,
          fontSize: "clamp(2.5rem, 6.25vw, 7.5rem)",
          letterSpacing: "-0.0533em",
        }}
      >
        인디업 INDEUP<span className="align-super text-[0.35em]">&reg;</span>
      </p>
      <Link
        href="/custom-fit/"
        className="mt-10 inline-flex cursor-pointer items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition-colors duration-200 hover:opacity-85"
      >
        맞춤 제작 가능 여부 확인
      </Link>
    </section>
  );
}
