import Image from "next/image";

/** Small stroke-icon set for the frame-detail cards — same visual language
 *  (viewBox 24, rounded stroke caps/joins) as the mute/unmute icons already
 *  used elsewhere on the site (DimensionShowcase, DesktopHeroVideo), just
 *  new glyphs. */
function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function DoubleShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3.5l6.5 2.5v5c0 3.8-2.6 6.3-6.5 7.5-3.9-1.2-6.5-3.7-6.5-7.5V6L8 3.5z" opacity="0.45" />
      <path d="M15.5 5l6.5 2.5v5c0 3.8-2.6 6.3-6.5 7.5-1.5-.46-2.75-1.1-3.73-1.95" />
    </svg>
  );
}

/** Card cell shared shape — used for every text cell so the row reads as
 *  one consistent box system regardless of what's inside. */
function Cell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-[280px] w-[78vw] shrink-0 snap-start flex-col justify-between rounded-2xl p-5 sm:h-auto sm:min-h-[170px] sm:w-auto sm:shrink sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** Shared sizing for the 4 video cards — same mobile-scroll/desktop-grid
 *  split as Cell, just without Cell's flex-col content layout (videos use
 *  absolute-positioned children instead). */
const videoCardClass =
  "relative h-[280px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-auto sm:min-h-[170px] sm:w-auto sm:shrink";

/** Material/frame detail — a compact "4 boxes, then one big photo" layout
 *  (not a sprawling multi-row bento) so the whole section reads as close to
 *  one screen as the content allows. Every claim on a card is either the
 *  section's own pre-existing copy or a fact already printed on
 *  frame_detale.jpg (the brand's own layer-structure graphic) — nothing new
 *  is asserted here. */
export default function FrameDetail() {
  return (
    <section id="process" className="mx-3 bg-white px-6 py-10 text-[var(--color-primary)] sm:mx-0 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-[1600px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
          <span className="text-[var(--color-primary)]">01</span> · 튼튼한 구조
        </p>
        <h2
          className="mt-3 font-semibold leading-tight tracking-[-0.02em]"
          style={{ fontSize: "var(--type-h2)" }}
        >
          흔들림을 줄이는 아연도금 프레임
        </h2>

        {/* Mobile: horizontal swipeable scroller (same snap-scroll pattern
            as InstagramReels) instead of 4 boxes stacked full-height on top
            of each other — that stacked version alone ran past 700px of
            scroll before even reaching the closing photo. Desktop keeps the
            original 4-column grid, unchanged. */}
        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {/* Video card — existing full-weld corner footage. */}
          <div className={videoCardClass}>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/frame-detail.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <span className="absolute bottom-5 left-5 right-5 text-base font-semibold leading-tight text-white">
              이음새 없이 하나로 이어지는 풀용접 구조
            </span>
          </div>

          {/* Water/coating footage (frame_water.mp4, optimized from
              1.92MB down to ~320KB), carrying the double-coating copy. Moved
              next to the weld video so the two dark, abstract material
              close-ups sit together, then the row transitions into the
              brighter lifestyle/comparison shots — reads as one tonal
              gradient instead of alternating dark/light per box. */}
          <div className={`${videoCardClass} text-white`}>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/frame-water.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
              <DoubleShieldIcon />
              <p className="text-base font-medium leading-[1.3]">
                아연도금 + 정품 분체도료
                <br />
                이중 방청 구조
              </p>
            </div>
          </div>

          {/* Video card — typing/desk-use footage, matching the wobble
              claim next to it. Re-encoded from the source down to
              800px-wide/10fps (same treatment as frame-detail.mp4) so it
              loads instantly instead of stalling. */}
          <div className={videoCardClass}>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/typing.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <span className="absolute bottom-5 left-5 right-5 text-base font-semibold leading-tight text-white">
              타이핑·모니터 사용 같은 반복적인 움직임에도 흔들림이 덜하도록 설계했습니다.
            </span>
          </div>

          {/* Rust-vs-galvanized footage (frame_years.mp4, optimized from
              5MB down to ~150KB), carrying the corrosion-resistance copy —
              a literal before/after demonstration of that claim. */}
          <div className={`${videoCardClass} text-white`}>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/videos/frame-years.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
              <ShieldCheckIcon />
              <p className="text-base font-medium leading-[1.3]">
                부식 걱정 없는
                <br />
                반영구적 내구성
              </p>
            </div>
          </div>
        </div>

        {/* Full-width closing photo — capped height (rather than the
            image's full intrinsic aspect ratio) so this section stays
            close to one screen; the shot has generous empty wall/floor
            margin above and below the subject, so a height crop here
            doesn't lose anything the frame_detale.jpg crop above needed
            to avoid. Pulled out of the card row above (it's a single full-
            width image, not another scroll item) — a lower, flatter height
            on mobile keeps the whole section shorter. */}
        <div className="relative mt-3 h-[180px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[440px]">
          <Image
            src="/frame_desk.jpg"
            alt="다양한 컬러와 사이즈로 조합되는 인디업 책상 프레임"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1600px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
